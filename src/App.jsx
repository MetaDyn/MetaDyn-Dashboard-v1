import React from 'react'
import { Box, Button, HStack, VStack, Container, Heading } from '@chakra-ui/react'
import { useState } from 'react'
import UserActivity from './components/UserActivity'
import AIActivity from './components/AIActivity'
import Leaderboard from './components/Leaderboard'

export default function App() {
  const [view, setView] = useState('user')

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <Heading size="xl" color="gray.700">Game Dashboard</Heading>
          
          <HStack spacing={4}>
            <Button
              size="lg"
              colorScheme={view === 'user' ? 'blue' : 'gray'}
              onClick={() => setView('user')}
            >
              User Activity
            </Button>
            <Button
              size="lg"
              colorScheme={view === 'ai' ? 'blue' : 'gray'}
              onClick={() => setView('ai')}
            >
              AI Activity
            </Button>
            <Button
              size="lg"
              colorScheme={view === 'leaderboard' ? 'blue' : 'gray'}
              onClick={() => setView('leaderboard')}
            >
              Leaderboard
            </Button>
          </HStack>

          <Box w="full" bg="white" p={6} borderRadius="lg" shadow="md">
            {view === 'user' && <UserActivity />}
            {view === 'ai' && <AIActivity />}
            {view === 'leaderboard' && <Leaderboard />}
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
