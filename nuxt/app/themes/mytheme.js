import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50:  '{orange.50}',
            100: '{orange.100}',
            200: '{orange.200}',
            300: '{orange.300}',
            400: '{orange.400}',
            500: '{orange.400}',
            600: '{orange.500}',
            700: '{orange.600}',
            800: '{orange.600}',
            900: '{orange.600}',
            950: '{orange.650}'
        }
    }
});

export default {
    preset: MyPreset,
};