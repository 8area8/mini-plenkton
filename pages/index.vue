<template>
    <div class="mt-10 md:container md:mx-auto columns-1 lg:columns-2">
        <div
            class="grid p-6 aspect-square mx-auto"
            v-for="file, index in files"
            :key="'file-' + index"
        >
            <img class="row-span-2 w-full aspect-video rounded-3xl" :src="`../assets/img/${file.meta.img.name}`" alt="abstract" />
            <h2 class="row-span-1 text-3xl lg:text-4xl font-letter">{{ file.meta.title }}</h2>
            <div class="row-span-1 flex items-center">
                <div class="mr-3 p-1 border border-black rounded" v-for="tag, index in file.meta.tags" :key="'tag-' + index">{{ tag }}</div>
                <time :datetime="file.meta.added" class="ml-3 text-stone-500 text-lg">Créé le {{ getLocalDate(file.meta.added) }}</time>
            </div>
            <div class="row-span-1 text-stone-700 text-lg tracking-wide leading&">
                {{ file.meta.intro }}
            </div>
        </div>
    </div>
        
</template>

<script setup>
const { data: files } = await useFetch('/api/content')
const { getLocalDate } = dateUtils()
</script>
