import axios from 'axios';
import dotenv from 'dotenv';


// Load environment variables from .env file
dotenv.config();
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0ClientId = process.env.AUTH0_CLIENT_ID;

if (!auth0Domain || !auth0ClientId) {
  throw new Error('Missing AUTH0_DOMAIN or AUTH0_CLIENT_ID environment variables.');
}

interface Auth0SignupResponse {
  email: string;
  _id: string;
}

interface Auth0LoginResponse {
  access_token: string;
  token_type: string;
}

export async function signupUser(email: string, password: string): Promise<Auth0SignupResponse> {
  try {
    const response = await axios.post<Auth0SignupResponse>(`https://${auth0Domain}/dbconnections/signup`, {
      client_id: auth0ClientId,
      email,
      password,
      connection: 'Username-Password-Authentication', // Replace with your database connection
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Auth0 Error:', error.response.data);
      throw new Error(error.response.data.error_description || error.message);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}


export async function loginUser(email: string, password: string): Promise<Auth0LoginResponse> {
  try {
    const response = await axios.post<Auth0LoginResponse>(`https://${auth0Domain}/oauth/token`, {
      client_id: process.env.AUTH0_CLIENT_ID,
      grant_type: 'password',
      username: email,
      password,
      audience:'http://localhost:3000',
      scope: 'openid', // Adjust scopes as per your Auth0 configuration
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error_description || error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
