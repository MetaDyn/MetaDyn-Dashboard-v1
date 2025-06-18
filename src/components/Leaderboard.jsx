import React from 'react'
import { Box, Table, Thead, Tbody, Tr, Th, Td, Input, Select, HStack, Text, Center, Spinner } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Leaderboard() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('score')

  useEffect(() => {
    fetchScores()
  }, [sortBy])

  async function fetchScores() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order(sortBy, { ascending: sortBy !== 'score' })

      if (error) throw error
      setScores(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredScores = scores.filter(score =>
    score.player_name?.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <Box>
      <HStack spacing={4} mb={6}>
        <Input
          placeholder="Filter by player name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="score">Score (High to Low)</option>
          <option value="player_name">Player Name</option>
          <option value="timestamp">Time</option>
        </Select>
      </HStack>

      {loading ? (
        <Center py={8}>
          <Spinner />
        </Center>
      ) : filteredScores.length === 0 ? (
        <Center py={8}>
          <Text>No scores found</Text>
        </Center>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Rank</Th>
                <Th>Player</Th>
                <Th>Score</Th>
                <Th>Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredScores.map((score, index) => (
                <Tr key={score.id}>
                  <Td>{index + 1}</Td>
                  <Td>{score.player_name}</Td>
                  <Td>{score.score}</Td>
                  <Td>{new Date(score.timestamp).toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  )
}
