<template>
    <div>This is a header</div>
    <div v-for="file, index in files" :key="'file-' + index">
    {{ file }}
    </div>

</template>

<script setup>
const { data: files } = await useFetch('/api/content')
// const files = await useFetch('/api/content/')
console.log(files)
console.log("okok")
</script>
