import { createApp } from 'vue';
import App from './App.vue';
import SvgIcon from './components/SvgIcon.vue';
import './styles/ui-stories.scss';
import 'virtual:host-styles';

const app = createApp(App);
app.component('svg-icon', SvgIcon);
app.mount('#app');
