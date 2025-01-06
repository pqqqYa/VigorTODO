<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Item from '../../components/ItemBox/Item/Item.vue'
import ItemSpace from '../../components/ItemBox/ItemSpace/ItemSpace.vine'
import SettingList from '../../components/SettingList/SettingList.vine'
import NoteTabBar from '../../components/TabBar/NoteTabBar.vue'
import TabBar from '../../components/TabBar/TabBar.vue'
import router from '../../router'
import emitter from '../../util/bus'
import openUrlInBrowser from '../../util/openUrlInBrowser'

const { t } = useI18n()

const menuShort = ref(window.innerWidth < 750)
emitter.on('menuClose', (data) => {
  menuShort.value = data as boolean
})

const isNoteUI = localStorage.getItem('newNoteUI') === 'true'
</script>

<template>
  <NoteTabBar v-if="isNoteUI" :title="t('otherList.toDonate')" />
  <TabBar
    v-else
    :title="t('otherList.toDonate')"
    :right-img-show="false"
    :left-img-show="true"
    bg-color="light"
    @left-click="router.back()"
  />
  <SettingList :h="isNoteUI ? '![calc(100vh-63px)]' : '![calc(100%-105px)]'">
    <ItemSpace flex="~ wrap gap-10px" items-center justify-center>
      <div w="100%">
        <h4>不必咖啡相伴，您轻点的一个 star，于我们而言，恰似香醇咖啡，足够暖心。</h4>
        <p whitespace-pre-line>扫码或点击下方连接前往仓库</p>
      </div>
      <img
        w-263px
        src="/images/donate/githubhome.png"
        alt=""
      >
    </ItemSpace>
    <Item :title="t('otherList.aboutSponser')" @item-fun="openUrlInBrowser('https://github.com/pqqqYa')" />
  </SettingList>
</template>
