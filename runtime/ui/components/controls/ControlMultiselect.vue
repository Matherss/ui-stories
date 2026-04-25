<template>
  <div class="uis-control uis-control--multiselect">
    <div class="uis-multiselect__tags">
      <span
        v-for="item in modelValue"
        :key="item"
        class="uis-multiselect__tag"
        @click="remove(item)"
      >
        {{ item }}
        <span class="uis-multiselect__tag-remove">&times;</span>
      </span>
    </div>

    <div class="uis-multiselect__options">
      <label
        v-for="opt in options"
        :key="opt"
        class="uis-multiselect__option"
        :class="{ 'is-selected': modelValue.includes(opt) }"
      >
        <input
          type="checkbox"
          :checked="modelValue.includes(opt)"
          @change="toggle(opt)"
        />
        {{ opt }}
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:modelValue']);

function toggle(opt) {
  const current = [...props.modelValue];
  const idx = current.indexOf(opt);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(opt);
  }
  emit('update:modelValue', current);
}

function remove(opt) {
  emit(
    'update:modelValue',
    props.modelValue.filter((v) => v !== opt),
  );
}
</script>

