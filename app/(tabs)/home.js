import { View, FlatList, Animated, StatusBar, ScrollView, StyleSheet } from 'react-native'
import { useAnimationStore } from '../../hooks/stores/useAnimationStore'
import AddEventButton from '../../components/AddEventButton'
import { useFeeds } from '../../hooks/queries/useFeed'
import { FlashList } from "@shopify/flash-list"
import FeedSkeleton from '../../components/FeedSkeleton'
import FeedItem from '../../components/home/FeedItem'
import { getStatusBarHeight } from '../../utils/methods'
import FeaturedClubs from '../../components/home/FeaturedClubs'
import { useFeaturedClubs } from '../../hooks/queries/useClub'
import SectionTitle from '../../components/SectionTitle'

export default function home() {
  
  const { data, refetch, isPending } = useFeeds()
  const { data: featuredClubs } = useFeaturedClubs()
  
  const { translateY } = useAnimationStore()

  if (isPending) return <ScrollView><FeedSkeleton loading /></ScrollView>

  return (
    <Animated.View style={{ flex: 1 }}>
      <StatusBar backgroundColor={'#EBEEF3'} barStyle="dark-content"/>
      <AddEventButton/>
      <FlashList
        data={data?.data?.feeds}
        ListHeaderComponentStyle={styles.listHeaderComponentStyle}
        ListEmptyComponent={<FeedSkeleton />}
        ItemSeparatorComponent={() => <View style={{ height: 50 }} />}
        ListFooterComponent={<View style={{paddingBottom: 100}}/>}
        renderItem={({item}) => <FeedItem item={item} refetch={refetch}/>}
        estimatedItemSize={50}
        ListHeaderComponent={
          <>
            <SectionTitle title={'Featured Clubs'} />
            <FeaturedClubs clubs={featuredClubs?.data?.featuredClubs} />
          </>
        }
        onScroll={(e) => {
          translateY.setValue(e.nativeEvent.contentOffset.y)
        }}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  listHeaderComponentStyle: {
    marginBottom: 20,
    marginTop: 80 + getStatusBarHeight()
  }
})