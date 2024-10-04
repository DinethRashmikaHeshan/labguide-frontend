import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading, Input, FormControl, FormLabel, Text, Link, VStack, useToast } from '@chakra-ui/react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to navigate
  const toast = useToast(); // Chakra UI toast for feedback

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/signup', { username, password });
      toast({
        title: "Signup successful!",
        description: "You can now log in.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate('/'); // Redirect to login page after signup
    } catch (error) {
      toast({
        title: "Signup error",
        description: "There was an error during signup. Please try again.",
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
          &lt;Lab Guide/&gt; - &lt;Signup /&gt;
        </Heading>
        <form onSubmit={handleSignup}>
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
              Signup
            </Button>
          </VStack>
        </form>

        <Text textAlign="center" mt={4}>
          Already have an account?{' '}
          <Link href="/" color="teal.300" fontWeight="bold">
            Login here
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Signup;
