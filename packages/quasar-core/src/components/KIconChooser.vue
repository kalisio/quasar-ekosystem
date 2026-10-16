<template>
  <KModal ref="modal" :buttons="getButtons()">
    <div class="column q-gutter-sm">
      <div class="row justify-between">
        <q-select for="icon-categories" id="icon-categories"
          v-if="categories"
          :label="$t('KIconChooser.SEARCH_CATEGORY_LABEL')"
          :options="categoryOptions"
          :value="selectedCategory ? selectedCategory.label : ''"
          @filter="filterCategoryAutocomplete"
          @update:model-value="onSelectCategory"
          use-input
          fill-input
          hide-selected
          input-debounce="0"
          clearable
          class="col-4"
          dense />
      </div>
      <div id="icons" class="row justify-start items-center q-gutter-sm">
        <template v-for="icon in iconsPage" :key="icon.name">
          <q-icon :id="getIconId(icon.name)" :color="getIconColor(icon.name)" :name="icon.name" size="2rem" @click="onIconSelected(icon)">
            <q-tooltip>{{icon.title}}</q-tooltip>
          </q-icon>
        </template>
      </div>
      <div class="row justify-center items-center q-gutter-sm">
        <q-pagination v-model="currentPage" :max="maxPage" :input="true" />
      </div>
      <div v-if="palette" class="row justify-between items-center q-gutter-sm">
        <k-palette id="palette" shape="round" v-model="selectedIcon.color" />
      </div>
    </div>
  </KModal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { findIndex, forOwn, kebabCase } from 'lodash-es'
import { load as yamlLoad } from 'js-yaml'
import KModal from './KModal.vue'
import KPalette from './KPalette.vue'
import { useI18n } from '../composables/index.js'

defineOptions({ name: 'k-icon-chooser' })

const props = defineProps({
  iconSet: {
    type: String,
    default: 'font-awesome',
    validator: (value) => ['material-icons', 'line-awesome', 'font-awesome'].includes(value)
  },
  palette: { type: Boolean, default: true }
})

const emit = defineEmits(['icon-choosed'])

const i18n = useI18n()

const modal = ref(null)
const allIcons = ref([])
const categories = ref(null)
const categoryInfos = ref(null)
const categoryOptions = ref(null)
const selectedCategory = ref(null)
const currentPage = ref(1)
const iconsPerPage = 70
const selectedIcon = ref({ name: '', color: 'dark' })

const icons = computed(() =>
  selectedCategory.value ? getIconsForCategory(selectedCategory.value.value) : allIcons.value
)
const maxPage = computed(() => Math.ceil(icons.value.length / iconsPerPage))
const iconsPage = computed(() => {
  const first = (currentPage.value - 1) * iconsPerPage
  const last = Math.min(currentPage.value * iconsPerPage, icons.value.length)
  return icons.value.slice(first, last)
})

function getIconId (name) { return kebabCase(name) }

function getIconColor (name) {
  if (name === selectedIcon.value.name) {
    return selectedIcon.value.color === 'white' ? 'black' : selectedIcon.value.color
  }
  return 'grey-7'
}

function getIconsForCategory () {
  const categoryIcons = categoryInfos.value[selectedCategory.value.value].icons
  const result = []
  for (const categoryIcon of categoryIcons) {
    const icon = allIcons.value.find(e => e.title === categoryIcon)
    if (icon) result.push(icon)
  }
  return result
}

function getCategoryOptions (cats) {
  return cats
    .map(cat => ({ value: cat, label: i18n.t('KIconChooser.categories.' + cat) }))
    .sort((c1, c2) => c1.label.localeCompare(c2.label))
}

function filterCategoryAutocomplete (categoryInput, updateCallback) {
  if (categoryInput.trim() === '') {
    updateCallback(() => { categoryOptions.value = getCategoryOptions(categories.value) })
  } else {
    const needle = categoryInput.trim().toLowerCase()
    updateCallback(() => {
      categoryOptions.value = getCategoryOptions(categories.value).filter(
        option => option.label.toLowerCase().includes(needle)
      )
    })
  }
}

function onSelectCategory (value) {
  currentPage.value = 1
  resetSelectedIcon()
  selectedCategory.value = value
}

function getButtons () {
  return [
    { id: 'cancel-button', label: 'CANCEL', outline: true, renderer: 'form-button', handler: () => doClose() },
    { id: 'choose-button', label: 'KIconChooser.DONE_BUTTON', renderer: 'form-button', handler: () => doDone() }
  ]
}

function open (defaultIcon) {
  reset()
  let index = -1
  if (defaultIcon) {
    if (typeof defaultIcon === 'string') selectedIcon.value.name = defaultIcon
    else Object.assign(selectedIcon.value, defaultIcon)
    index = findIndex(allIcons.value, icon => icon.name === selectedIcon.value.name)
  }
  currentPage.value = index === -1 ? 1 : Math.ceil(index / iconsPerPage)
  modal.value.open()
}

function reset () {
  selectedCategory.value = null
  currentPage.value = 1
  resetSelectedIcon()
  resetSelectedColor()
}

function doDone () {
  emit('icon-choosed', props.palette ? selectedIcon.value : selectedIcon.value.name)
  doClose()
}

function doClose () { modal.value.close() }

function onIconSelected (icon) {
  if (selectedIcon.value.name === icon.name) resetSelectedIcon()
  else selectedIcon.value.name = icon.name
}

function resetSelectedIcon () { selectedIcon.value.name = '' }
function resetSelectedColor () { selectedIcon.value.color = 'dark' }

async function loadMaterialIcons () {
  const response = await fetch('https://raw.githubusercontent.com/google/material-design-icons/3.0.2/iconfont/codepoints')
  if (response.status !== 200) throw new Error('Impossible to retrieve material-icons code points: ' + response.status)
  const text = await response.text()
  let result = text.split(/\s+/).filter((name, index) => index % 2 === 0 && name !== '')
  if (result.length === 0) throw new Error('Impossible to parse material-icons code points')
  result.sort()
  return { icons: result.map(name => ({ name, title: name })), categories: null, categoryInfos: null }
}

async function loadFontAwesomeCategories () {
  const response = await fetch('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/5.11.2/metadata/categories.yml')
  if (response.status !== 200) throw new Error('Impossible to retrieve fontawesome categories: ' + response.status)
  try { return yamlLoad(await response.text()) } catch (error) { throw new Error('Impossible to parse fontawesome categories: ' + error) }
}

async function loadFontAwesomeIcons () {
  const response = await fetch('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/5.11.2/metadata/icons.yml')
  if (response.status !== 200) throw new Error('Impossible to retrieve fontawesome code points: ' + response.status)
  try {
    const list = []
    forOwn(yamlLoad(await response.text()), (value, key) => addFontAwesomeIcons(list, value, key))
    const catInfos = await loadFontAwesomeCategories()
    if (list.length === 0) throw new Error('Impossible to parse fontawesome code points')
    return { icons: list, categoryInfos: catInfos, categories: Object.keys(catInfos) }
  } catch (error) {
    throw new Error('Impossible to parse fontawesome categories: ' + error)
  }
}

function addFontAwesomeIcons (list, value, key) {
  const prefix = props.iconSet === 'line-awesome' ? 'la' : 'fa'
  if (!value.styles) {
    list.push({ name: `${prefix}-${key}`, title: key })
  } else if (value.styles.includes('brands')) {
    list.push({ name: `${prefix}b ${prefix}-${key}`, title: key })
  } else {
    if (value.styles.includes('regular')) list.push({ name: `${prefix}r ${prefix}-${key}`, title: key })
    if (value.styles.includes('solid')) list.push({ name: `${prefix}s ${prefix}-${key}`, title: key })
    if (value.styles.includes('light')) list.push({ name: `${prefix}l ${prefix}-${key}`, title: key })
  }
}

onMounted(async () => {
  const result = await (props.iconSet === 'material-icons' ? loadMaterialIcons() : loadFontAwesomeIcons())
  allIcons.value = result.icons
  categories.value = result.categories
  categoryInfos.value = result.categoryInfos
})

function iconSelected () { return selectedIcon.value.name.length > 0 }
function addFontAwsomeIcon (list, key, icon) { list.push({ name: icon, title: key }) }

defineExpose({ open, iconSelected, addFontAwsomeIcon })
</script>
