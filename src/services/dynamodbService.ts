import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import AWS from "aws-sdk"; // Only needed for configuring AWS SDK v2
import bcrypt from "bcryptjs";

// AWS SDK v2 configuration (if still needed for other parts of your application)
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

// Create a DynamoDB v3 client
const client = new DynamoDBClient({});

// Create DynamoDBDocumentClient from the DynamoDB v3 client
const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "User_table";

export const signupUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const params = {
    TableName: TABLE_NAME,
    Item: {
      userId: email,
      email,
      password: hashedPassword,
    },
    ConditionExpression: "attribute_not_exists(userId)",
  };

  try {
    await dynamoDB.send(new PutCommand(params));
    return { email };
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId: email,
    },
  };

  try {
    const data = await dynamoDB.send(new GetCommand(params));
    if (!data.Item) {
      throw new Error("User not found");
    }

    const { password: hashedPassword } = data.Item;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) {
      throw new Error("Unauthorized");
    }

    return { email };
  } catch (error) {
    throw error;
  }
};
