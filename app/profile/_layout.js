import { Slot, Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name='manage'
      />
      <Stack.Screen
        name='clubs'
      />
      <Stack.Screen
        name='admin'
      />
    </Stack>
  )
}