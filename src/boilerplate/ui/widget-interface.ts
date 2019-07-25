import Vue from 'vue';

export interface IWidget extends Vue {
    ready(): void;
}
