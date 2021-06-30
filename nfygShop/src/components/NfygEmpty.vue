<template>
    <div class="nfyg-empty">
        <img :src="require('@/assets/no_' + type + '.png')" :alt="text" />
        <p>{{text}}</p>
    </div>
</template>

<script>
    export default {
        name: '',
        props: ['type', 'text'],
    }
</script>