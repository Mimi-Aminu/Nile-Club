import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../utils/axios";
import Toast from '../../utils/toast'
import { router } from "expo-router";
import { useAuthStore } from "../stores/useAuthStore";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { socket } from '../../socket.io/socket'

export const useCreateClub = () => {

  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-club"],
    mutationFn: async (data) => {
      return await axios.post("/club", data)
    },
    onSuccess: async data => {
      Toast(data.data?.message)
      await queryClient.invalidateQueries(['user'])
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error message
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
  })
}

export const useEditClub = () => {

  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["edit-club"],
    mutationFn: async (data) => {
      return await axios.put("/club", data)
    },
    onSuccess: async data => {
      Toast(data.data?.message)
      await queryClient.invalidateQueries(['user'])
      await queryClient.invalidateQueries(['club', data?.data?.club?._id])
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error message
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
  })
}

export const useClub = clubId => {
  return useQuery({
    queryKey: ['club', clubId],
    queryFn: async () => {
      return axios.get(`/club?clubId=${clubId}`)
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error message
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
    retry: true,
  })
}

export const useClubFeeds = clubId => {
  return useQuery({
    queryKey: ['club-feeds', clubId],
    queryFn: async () => {
      return axios.get(`/club/feed?clubId=${clubId}`)
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error message
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
    retry: true,
  })
}

export const useFeaturedClubs = () => {
  return useQuery({
    queryKey: ['featured-clubs'],
    queryFn: async () => {
      return axios.get(`/club/feature`)
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error message
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
    retry: true,
  })
}

export const useFollowingClub = (clubId) => {
  return useQuery({
    queryKey: ['following-club', clubId],
    queryFn: async () => {
      return axios.get(`/club/follow?clubId=${clubId}`)
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error message
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
    retry: true,
  })
}

export const useSetFollowClub = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["follow-club"],
    mutationFn: async (data) => {
      return await axios.post("/club/follow", data)
    },
    onSuccess: (data) => {
      Toast(data.data?.message)
      socket.emit('join-room')
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error message
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
    onSettled: async () => {
      queryClient.invalidateQueries(['chats'])
      queryClient.invalidateQueries(['feeds'])
      queryClient.invalidateQueries(['following-club'])
      queryClient.invalidateQueries(['club-membership'])
    }
  })
}

export const useComments = clubId => {
  return useQuery({
    queryKey: ['comments', clubId],
    queryFn: async () => {
      return await axios.get(`/club/comment?clubId=${clubId}`)
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
  })
}

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-comment"],
    mutationFn: async (data) => {
      return await axios.post("/club/comment", data)
    },
    onSuccess: (data) => {
      Toast(data.data?.message)
    },
    // onMutate: async (newComment) => {
    //   await queryClient.cancelQueries(['comments'])
    //   const previousComments = queryClient.getQueryData(['comments'])

    //   queryClient.setQueryData(['comments'], (oldQueryData) => {
    //     if (!previousComments) return null // coz if there is no previous comments, we don't need to update the query data. besides, oldQueryData will be null or undefined and cannot be spread
    //     return {
    //       ...oldQueryData,
    //       data: [...oldQueryData.data.comments, newComment]
    //     }
    //   })
    //   return { previousComments }
    // },
    onError: (error, _request, context) => {
      // queryClient.setQueryData(['comments'], context.previousComments)

      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error message
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries(['comments'])
    },
  })
}

export const useClubMembership = () => {
  return useQuery({
    queryKey: ['club-membership'],
    queryFn: async () => {
      return await axios.get(`/club/membership`)
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
  })
}

export const useClubMembers = queries => {
  const { search, clubId } = queries
  return useQuery({
    queryKey: ['club-members', clubId],
    queryFn: async () => {
      return await axios.get(`/club/member?clubId=${clubId}&?search=${search}`)
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
  })
}

export const useAssignRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["assign-role"],
    mutationFn: async (data) => {
      return await axios.post("/club/role", data)
    },
    onSuccess: (data) => {
      Toast(data.data?.message)
    },
    onMutate: async (newMember) => {
      await queryClient.cancelQueries(['club-members'])
      const previousMembers = queryClient.getQueryData(['club-members'])

      queryClient.setQueryData(['club-members'], (oldQueryData) => {
        if (!previousMembers) return null // coz if there is no previous members, we don't need to update the query data. besides, oldQueryData will be null or undefined and cannot be spread
        return {
          ...oldQueryData,
          data: [...oldQueryData.data.members, newMember]
        }
      })
      return { previousMembers }
    },
    onError: (error, _request, context) => {
      queryClient.setQueryData(['club-members'], context.previousMembers)

      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error message
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries(['club-members'])
    },
  })
}

export const useReviewClub = (clubId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["review-club"],
    mutationFn: async (data) => {
      return await axios.post("/club/review", data)
    },
    onSuccess: (data) => {
      Toast(data.data?.message)
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error message
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
    onSettled: async () => {
      queryClient.invalidateQueries(['club', clubId])
    }
  })
}

export const useClubs = () => {
  return useQuery({
    queryKey: ['clubs-approval'],
    queryFn: async () => {
      return await axios.get(`/club/approval`)
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
  })
}

export const useApproveClub = (clubId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["approve-club", clubId],
    mutationFn: async (data) => {
      return await axios.post("/club/approval", data)
    },
    onSuccess: (data) => {
      Toast(data.data?.message)
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error message
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
    onSettled: async () => {
      queryClient.invalidateQueries(['clubs-approval'])
    }
  })
}

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['club-analytics'],
    queryFn: async () => {
      return await axios.get(`/club/analytic`)
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
  })
}

export const useDiscover = () => {
  return useQuery({
    queryKey: ['discover'],
    queryFn: async () => {
      return await axios.get(`/feed/discover`)
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
    retry: 1
  })
}

export const useDiscoverSearch = (search) => {
  return useQuery({
    queryKey: ['discover', search],
    queryFn: async () => {
      return await axios.get(`/feed/discover?search=${search}`)
    },
    onError: (error) => {
      Toast(error.response?.data.message || error.message) // prioritize server error message, then client error
      if (error?.response?.status === 401) { // user isn't logged in
        router.replace('/signin')
      }
    },
    enabled: search.length > 0
  })
}