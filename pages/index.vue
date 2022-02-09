<template>
    <div class="p-2 grid lg:grid-cols-2 gap-20 my-10 container mx-auto">
        <article
            class="grid mx-auto group transition-all duration-700 ease-out hover:cursor-pointer"
            v-for="file, index in files"
            :key="'file-' + index"
        >
            <img class="group-hover:contrast-150 transition-all duration-1000 ease-out w-full aspect-video rounded-xl md:rounded-3xl" :src="`../assets/img/${file.meta.img.name}`" alt="abstract" />
            <h2 class="group-hover:text-zinc-700 ease-out transition-all duration-6000 mt-8 text-3xl lg:text-4xl font-letter">{{ file.meta.title }}</h2>
            <div class="group-hover:text-zinc-600 ease-out transition-all mt-6 flex flex-wrap items-center">
                <div class="my-2 last:mr-6 mr-3 p-2 border border-black rounded" v-for="tag, index in file.meta.tags" :key="'tag-' + index">{{ tag }}</div>
                <time :datetime="file.meta.added" class="py-4 text-stone-500 text-lg">Ajouté le {{ getLocalDate(file.meta.added) }}</time>
            </div>
            <div class="text-justify group-hover:text-zinc-600 ease-out transition-all mt-3 sm:mt-6 text-stone-700 text-lg tracking-wide leading&">
                {{ file.meta.intro }}
            </div>
        </article>
    </div>
        
</template>

<script setup>
const { data: files } = await useFetch('/api/content')
const { getLocalDate } = dateUtils()
</script>
