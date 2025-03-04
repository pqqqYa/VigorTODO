<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ipcRenderer } from 'electron'
import router from '../router'
import TabBar from '../components/TabBar/TabBar.vue'
import SettingList from '../components/SettingList/SettingList.vine'
import Alert from '../components/Alert/Alert.vue'
import Item from '../components/ItemBox/Item/Item.vue'
import ItemButton from '../components/ItemBox/ItemButton/ItemButton.vue'
import emitter from '../util/bus'
import { createToast } from '../components/Toast'
import ItemSpace from '../components/ItemBox/ItemSpace/ItemSpace.vine'
import NoteTabBar from '../components/TabBar/NoteTabBar.vue'

const { t } = useI18n()

const form = ref('')
const route = useRoute()

watchEffect(() => {
  form.value = route.query.from as unknown as string
})

const swichState = ref(localStorage.getItem('autoSync') === 'true' || localStorage.getItem('autoSync') === null)

function setAutoSync() {
  swichState.value = !swichState.value
  localStorage.setItem('autoSync', `${swichState.value}`)
}

const loginText = ref('')

const loginState = ref(localStorage.getItem('uid') !== '' && localStorage.getItem('uid') !== null)

onMounted(() => {
  if (!loginState.value)
    loginText.value = t('loginText')
  else
    loginText.value = localStorage.getItem('uname')!
})

function changPass() {
  ipcRenderer.send('open-repass', localStorage.getItem('uname'))
}

function openRegister() {
  ipcRenderer.send('open-register')
}

const uname = ref('')
const passwd = ref('')
const alertMsg = ref([''])
const alertShow = ref(false)

function login() {
  if (uname.value === 'adm' && passwd.value === '123') {
    loginText.value = 'adm'
    localStorage.setItem('uname', 'adm')
    localStorage.setItem('uid', '123') // 使用固定ID
    loginState.value = true
    createToast({ msg: t('accountPage.syncData') })
    localStorage.setItem('autoSync', 'true')
    swichState.value = true
    emitter.emit('setLoginText', 'adm')
  }
  else {
    alertMsg.value = [t('accountPage.loginError')]
    alertShow.value = true
  }
}

const isLogoutClick = ref(false)

function logout() {
  alertShow.value = true
  isLogoutClick.value = true
  alertMsg.value = [t('accountPage.logoutMsg')]
}

function returnAlert() {
  if (isLogoutClick.value) {
    loginText.value = t('loginText')
    localStorage.setItem('uname', '')
    localStorage.setItem('uid', '')
    localStorage.setItem('autoSync', 'false')
    swichState.value = false
    loginState.value = false
    alertShow.value = false
    isLogoutClick.value = false
    emitter.emit('setLoginText', t('loginText'))
    return
  }
  alertShow.value = false
  isLogoutClick.value = false
}

function closeAlert() {
  alertShow.value = false
  isLogoutClick.value = false
}

function openLogoff() {
  ipcRenderer.send('open-logoff', localStorage.getItem('uname'))
}

const isNoteUI = localStorage.getItem('newNoteUI') === 'true'
</script>

<template>
  <NoteTabBar v-if="isNoteUI" :title="t('accountPage.account')" />
  <TabBar
      v-else
      :title="t('accountPage.account')"
      :right-img-show="false"
      :left-img-show="form === 'setting'"
      bg-color="light"
      @left-click="() => router.back()"
  />
  <SettingList :h="isNoteUI ? '![calc(100vh-63px)]' : '![calc(100%-105px)]'">
    <Item :title="loginText" :show-arrow="false" />
    <ItemSpace v-if="!loginState">
      <input
          v-model="uname"
          m="x-0 y-5px" c="black dark:#bbb"
          border="1.5px solid #00000020" bg="#00000010" rounded-5px p-15px
          outline="primary-d dark:primary-a"
          type="text"
          :placeholder="t('accountPage.account')"
      >
      <input
          v-model="passwd"
          m="x-0 y-5px" c="black dark:#bbb"
          border="1.5px solid #00000020" bg="#00000010" rounded-5px p-15px
          outline="primary-d dark:primary-a"
          type="password"
          :placeholder="t('accountPage.passwd')"
          @keydown.enter="login"
      >
    </ItemSpace>
    <ItemButton v-if="!loginState" mode="primary" @click="login">
      {{ t('accountPage.login') }}
    </ItemButton>
    <ItemButton v-if="!loginState" @click="openRegister">
      {{ t('accountPage.register') }}
    </ItemButton>
    <Item
        v-if="loginState"
        :title="t('accountPage.autoSync')"
        :show-switch="true"
        :switch-state="swichState"
        @switch-fun="setAutoSync"
    />
    <ItemButton v-if="loginState" @click="changPass">
      {{ t('accountPage.changPass') }}
    </ItemButton>
    <ItemButton v-if="loginState" @click="openLogoff">
      {{ t('logoffPage.logoff') }}
    </ItemButton>
    <ItemButton v-if="loginState" mode="error" @click="logout">
      {{ t('accountPage.logout') }}
    </ItemButton>
    <Alert
        :title="t('accountPage.alertTitle')"
        :cancel-button-show="isLogoutClick"
        :dialog-show="alertShow"
        @return="returnAlert"
        @cancel="closeAlert"
    >
      <span>{{ alertMsg[0] }}</span>
    </Alert>
  </SettingList>
</template>