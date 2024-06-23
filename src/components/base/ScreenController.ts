import { Screen } from '../../types/types';

export class ScreenController {
	currentScreen: Screen | null = null;

	changeScreen(screen: Screen): void {
		if (this.currentScreen) {
			this.currentScreen.hide();
		}
		this.currentScreen = screen;
		this.currentScreen.show();
	}
}
