import { Show, useUser, useAuth } from '@clerk/expo'
import { useClerk } from '@clerk/expo'
import { Link } from 'expo-router'
import { Text, View, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'

interface UserData {
  userId: string;
  firstName?: string;
  lastName?: string;
  lastActivity?: string;
}

export default function Page() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { getToken } = useAuth()
  const [apiResponse, setApiResponse] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Call backend API with Clerk token
  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get the Clerk session token
      const token = await getToken()
      
      if (!token) {
        setError('No authentication token available')
        return
      }

      // Call the backend protected endpoint
      const response = await fetch('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(`Backend error: ${errorData.error || response.statusText}`)
        return
      }

      const data = await response.json()
      setApiResponse(data.user)
    } catch (err) {
      setError(`Failed to fetch user data: ${err instanceof Error ? err.message : String(err)}`)
      console.error('API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch user data when component mounts
  useEffect(() => {
    // Only fetch if signed in
    if (user) {
      fetchUserData()
    }
  }, [user])

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Show when="signed-out">
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </Show>
      <Show when="signed-in">
        <Text style={styles.greeting}>Hello {user?.emailAddresses[0].emailAddress}</Text>
        
        {/* API Response Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backend API Response:</Text>
          
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0a7ea4" />
              <Text style={styles.loadingText}>Fetching data from backend...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={fetchUserData}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          )}

          {apiResponse && !loading && (
            <View style={styles.responseContainer}>
              <Text style={styles.responseLabel}>User ID:</Text>
              <Text style={styles.responseValue}>{apiResponse.userId}</Text>
              
              {apiResponse.firstName && (
                <>
                  <Text style={styles.responseLabel}>First Name:</Text>
                  <Text style={styles.responseValue}>{apiResponse.firstName}</Text>
                </>
              )}
              
              {apiResponse.lastName && (
                <>
                  <Text style={styles.responseLabel}>Last Name:</Text>
                  <Text style={styles.responseValue}>{apiResponse.lastName}</Text>
                </>
              )}
              
              <Text style={styles.successText}>✓ Backend authentication working!</Text>
            </View>
          )}
        </View>

        <Pressable style={styles.button} onPress={fetchUserData} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Refresh User Data'}</Text>
        </Pressable>

        <Pressable style={styles.signOutButton} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
      </Show>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 18,
    marginBottom: 16,
  },
  section: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  responseContainer: {
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  responseLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  responseValue: {
    color: '#333',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  successText: {
    color: '#2e7d32',
    fontSize: 14,
    marginTop: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  signOutButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
})