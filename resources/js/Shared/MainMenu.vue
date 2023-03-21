<template>
    <div>
        <div class="mb-4">
            <Link class="group flex items-center py-3" href="/dashboard">
            <icon name="dashboard" class="mr-2 w-4 h-4"
                :class="isUrl('/dashboard') ? 'fill-gray-600' : 'fill-black group-hover:fill-gray-600'" />
            <div :class="isUrl('/dashboard') ? 'text-gray-600' : 'text-black group-hover:text-gray-600'">Dashboard</div>
            </Link>
        </div>
    </div>
</template>

<script setup>
import { Link } from '@inertiajs/inertia-vue3'
import Icon from '@/Shared/Icon.vue'
import { usePage } from '@inertiajs/inertia-vue3'

function isUrl(...urls) {
    let currentUrl = usePage().url.value.substr(1)
    if (urls[0] === '') {
        return currentUrl === ''
    }
    return urls.filter((url) => currentUrl.startsWith(url)).length
}
</script>
