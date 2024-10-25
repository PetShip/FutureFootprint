import { supabase } from '../supabase';  // Import the Supabase client from your supabase.js file

// Function to fetch posts from the 'posts' table in Supabase
export const getPosts = async () => {
  try {
    // Fetch data from the 'posts' table
    const { data, error } = await supabase
      .from('posts')   // Specify the table you're fetching from
      .select('*');    // Select all fields from the table

    // Check for errors during the fetching process
    if (error) {
      console.error('Error fetching posts:', error.message); // Log the full error message
      console.error('Error details:', error);  // Log detailed error information
      throw new Error('Error fetching posts');  // Throw a new error for handling in the UI
    }

    // Return the fetched data (posts)
    console.log('Posts fetched successfully:', data);  // Log the fetched posts data for debugging
    return data;

  } catch (err) {
    // Handle any unexpected errors (network issues, etc.)
    console.error('Unexpected error occurred:', err.message);
    throw new Error('Failed to fetch posts');
  }
};
