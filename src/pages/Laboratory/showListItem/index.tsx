import type ListItems from './ListItems'
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Item from '../../../components/ItemBox/Item/Item.vue'
import ItemBox from '../../../components/ItemBox/ItemBox.vue'
import SettingList from '../../../components/SettingList/SettingList.vine'
import NoteTabBar from '../../../components/TabBar/NoteTabBar.vue'
import TabBar from '../../../components/TabBar/TabBar.vue'
import emitter from '../../../util/bus'

const ShowListItem: SetupFC = () => {
  const router = useRouter()

  const { t } = useI18n()

  const showList = reactive(localStorage.getItem('listMenuItem') && JSON.parse(localStorage.getItem('listMenuItem')!).today.name !== 'today'
    ? JSON.parse(localStorage.getItem('listMenuItem')!) as ListItems
    : {
        today: {
          name: 'custList.today',
          show: true,
        },
        star: {
          name: 'custList.star',
          show: true,
        },
        allDo: {
          name: 'custList.completed',
          show: true,
        },
        allNotDo: {
          name: 'custList.incompleted',
          show: true,
        },
      } as ListItems,
  )

  const showAll = ref(Object.keys(showList).map(key => showList[key as keyof ListItems].show).every(t => t))

  watch(
    showList,
    (newValue) => {
      showAll.value = Object.keys(newValue).map(key => newValue[key as keyof ListItems].show).every(t => t)
    },
  )

  const isNoteUI = localStorage.getItem('newNoteUI') === 'true'

  return () => (
    <>
      {isNoteUI
        ? <NoteTabBar title={t('custListItem')} />
        : (
            <TabBar
              title={t('custListItem')}
              rightImgShow={false}
              leftImgShow={true}
              onLeftClick={() => router.back()}
              bg-color="light"
            />
          )}

      <SettingList h={isNoteUI ? '![calc(100vh-65px)]' : '![calc(100%-105px)]'}>
        <Item
          title={t('custList.showAll')}
          showSwitch={true}
          switchState={showAll.value}
          onSwitchFun={() => {
            Object.keys(showList).forEach((key) => {
              showList[key as keyof ListItems].show = !showAll.value
            })
            localStorage.setItem('listMenuItem', JSON.stringify(showList))
            emitter.emit('setListItem', showList)
          }}
        />
        <ItemBox>
          {Object.keys(showList).map(key => (
            <Item
              title={t(showList[key as keyof ListItems].name)}
              showSwitch={true}
              switchState={showList[key as keyof ListItems].show}
              onSwitchFun={() => {
                showList[key as keyof ListItems].show = !showList[key as keyof ListItems].show
                localStorage.setItem('listMenuItem', JSON.stringify(showList))
                emitter.emit('setListItem', showList)
              }}
            />
          ))}
        </ItemBox>
      </SettingList>
    </>
  )
}

export default ShowListItem
