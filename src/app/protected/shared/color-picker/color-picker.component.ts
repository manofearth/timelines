import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tl-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
  providers:       [
    {
      provide:     NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi:       true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent implements ControlValueAccessor {

  @Input() colors: string[] = [];

  currentColor: string;
  isOpened: boolean = false;

  private onChangeFn: (color: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  toggle() {
    this.isOpened = !this.isOpened;
    this.onTouchedFn();
  }

  onColorPick(color: string) {
    this.currentColor = color;
    this.isOpened = false;
    this.onChangeFn(color);
  }

  writeValue(color: string): void {
    this.currentColor = color;
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

}
