import React from 'react'
import { Box, Table, Thead, Tbody, Tr, Th, Td, Input, Select, HStack, Text, Center, Spinner } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '../supabase'

export default function UserActivity() {
  const [activities, setActivities] = useState([])
  const [dailyStats, setDailyStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at')

  useEffect(() => {
    fetchActivities()
    fetchDailyStats()
  }, [])

  async function fetchDailyStats() {
    try {
      // Get the date 7 days ago
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { data, error } = await supabase
        .from('user_activity')
        .select('created_at')
        .gte('created_at', sevenDaysAgo.toISOString())

      if (error) throw error

      // Process data for the chart
      const dailyCounts = {}
      data.forEach(activity => {
        const date = new Date(activity.created_at).toLocaleDateString()
        dailyCounts[date] = (dailyCounts[date] || 0) + 1
      })

      // Create array for last 7 days
      const stats = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toLocaleDateString()
        stats.push({
          date: dateStr,
          count: dailyCounts[dateStr] || 0
        })
      }

      setDailyStats(stats)
    } catch (error) {
      console.error('Error fetching daily stats:', error)
    }
  }

  async function fetchActivities() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .order(sortBy, { ascending: false })

      if (error) throw error
      setActivities(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredActivities = activities.filter(activity =>
    activity.action?.toLowerCase().includes(filter.toLowerCase()) ||
    activity.user_id?.toLowerCase().includes(filter.toLowerCase()) ||
    activity.city?.toLowerCase().includes(filter.toLowerCase()) ||
    activity.country?.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <Box>
      {/* Activity Graph */}
      <Box mb={6} bg="white" borderRadius="lg">
        <Text p={4} fontSize="lg" fontWeight="medium">User Activity - Last 7 Days</Text>
        <Box h="200px" p={4}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3182CE" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Filters */}
      <HStack spacing={4} mb={6}>
        <Input
          placeholder="Filter by action, user, city, or country"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="created_at">Time</option>
          <option value="action">Action</option>
          <option value="user_id">User ID</option>
          <option value="country">Country</option>
        </Select>
      </HStack>

      {/* Activity Table */}
      {loading ? (
        <Center py={8}>
          <Spinner />
        </Center>
      ) : filteredActivities.length === 0 ? (
        <Center py={8}>
          <Text>No user activities found</Text>
        </Center>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Time</Th>
                <Th>User ID</Th>
                <Th>Action</Th>
                <Th>Details</Th>
                <Th>Location</Th>
                <Th>IP</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredActivities.map((activity) => (
                <Tr key={activity.id}>
                  <Td>{new Date(activity.created_at).toLocaleString()}</Td>
                  <Td>{activity.user_id}</Td>
                  <Td>{activity.action}</Td>
                  <Td>{activity.details}</Td>
                  <Td>
                    {[activity.city, activity.region, activity.country]
                      .filter(Boolean)
                      .join(', ')}
                  </Td>
                  <Td>{activity.ip}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  )
}
