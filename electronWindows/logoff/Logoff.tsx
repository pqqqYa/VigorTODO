import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ipcRenderer } from 'electron'
import CloseButton from '../../src/components/CloseButton/CloseButton.vine'
import Alert from '../../src/components/Alert/Alert.vue'
import { isMac } from '../../src/util/os'
import { closeWindow } from '../../src/util/windowApi'

const Logoff: SetupFC = () => {
  const { t } = useI18n()

  const formData = reactive({
    account: '',
    passwd: '',
  })

  ipcRenderer.on('getUserName', (_ev, name: string) => {
    formData.account = name
  })

  const showDialog = ref(false)
  const dialogText = ref('')

  const logoff = () => {
    // 模拟注销成功
    dialogText.value = t('logoffPage.success')
    showDialog.value = true
  }

  const closeDialog = () => {
    showDialog.value = false
    if (dialogText.value === t('logoffPage.success'))
      closeWindow('logoff')
  }

  return () => (
    <div
      drag
      flex
      justify-center
      items-center
      h-screen
      w-screen
    >
      <div
        flex="~ col"
        justify-center
        items-center
      >
        <div flex="~ row" items-center justify-center>
          <span
            w-25
            flex
            justify-content-right
            c="#555 dark:#bbb"
          >
            {t('registerPage.account')}
          </span>
          <input
            no-drag
            outline-primary-d
            mb-10px
            p-10px
            rounded-5px
            border="2px solid black/10"
            type="text"
            disabled
            v-model={formData.account}
          />
        </div>
        <div flex="~ row" items-center justify-center>
          <span
            w-25
            flex
            justify-content-right
            c="#555 dark:#bbb"
          >
            {t('registerPage.password')}
          </span>
          <input
            v-focus
            no-drag
            outline="primary-d dark:primary-a"
            mb-10px
            p-10px
            rounded-5px
            border="2px solid black/10"
            bg="black/10 dark:#999/10"
            c="#555 dark:#bbb"
            type="password"
            v-model={formData.passwd}
          />
        </div>
        <button
          no-drag
          cursor-pointer
          bg="primary-d active:primary-a dark:primary-a dark:active:primary-d"
          c-white
          border-none
          p-10px
          rounded-5px
          onClick={logoff}
        >
          {t('logoffPage.logoff')}
        </button>
      </div>
      <Alert
        dialogShow={showDialog.value}
        cancelButtonShow={false}
        onReturn={closeDialog}
        title={t('accountPage.alertTitle')}
      >
        <span>{dialogText.value}</span>
      </Alert>
      {/* eslint-disable-next-line ts/ban-ts-comment */}
      {/* @ts-expect-error */}
      {!isMac() ? <CloseButton windowName="logoff" /> : null}
    </div>
  )
}

export default Logoff
