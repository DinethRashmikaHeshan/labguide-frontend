import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading, Input, FormControl, FormLabel, Text, Link, VStack, useToast } from '@chakra-ui/react';

const Login = ({ setToken, setUsername: setParentUsername, setUserId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to navigate
  const toast = useToast(); // Chakra UI toast for alerts

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
      
      const { token, user } = response.data;

      if (!user) {
        throw new Error('User data is not available');
      }

      // Store the token, username, and userId in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('username', user.username); // Store username
      localStorage.setItem('userId', user._id); // Store user ID
  
      // Set token and user data in parent component
      setParentUsername(user.username); 
      setToken(token);
      setUsername(user.username);
      setUserId(user._id);
  
      // Navigate to the code editor page
      navigate(user.isInstructor ? '/exams' : '/home');
      
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message); // Log the error response
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      bgGradient="linear(to-r, gray.900, gray.800, gray.900)"  // Darker background gradient
    >
      <Box
        p={8}
        maxWidth="400px"
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="gray.700"  // Dark gray form box
        color="white"  // White text for better contrast
      >
        <Heading textAlign="center" mb={6} fontSize="2xl" fontWeight="bold" color="teal.300">
          &lt;Lab Guide/&gt; - &lt;Login /&gt;
        </Heading>
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="gray.600"  // Input field background
                color="white"
                _placeholder={{ color: "gray.400" }}  // Lighter placeholder color
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="gray.600"  // Input field background
                color="white"
                _placeholder={{ color: "gray.400" }}  // Lighter placeholder color
              />
            </FormControl>

            <Button 
              type="submit" 
              colorScheme="teal" 
              width="full" 
              mt={4}
              _hover={{ bg: "teal.500" }}
            >
              Login
            </Button>
          </VStack>
        </form>

        <Text textAlign="center" mt={4}>
          Don't have an account?{' '}
          <Link href="/signup" color="teal.300" fontWeight="bold">
            Signup here
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Login;
