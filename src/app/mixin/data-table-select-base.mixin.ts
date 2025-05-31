import {Directive, inject, Type, ViewChild} from '@angular/core';
import {MatCheckbox} from '@angular/material/checkbox';
import {UtilsService} from '../services/core/utils.service';


export interface Selectable {
  allTableData: any[];
  isIndeterminate: boolean;
  selectedIds: string[];
  matCheckbox: MatCheckbox;

  checkAndUpdateSelect(): void;

  checkSelectionData(): void;

  onAllSelectChange(event: any): void;

  onCheckChange(event: any, id: string): void;

  onTableRowClick(id: string): void;
}

export function DataTableSelectionBase<T extends Type<{}>>(Base: T) {
  @Directive()
  class SelectableClass extends Base implements Selectable {
    allTableData: any[] = [];
    isIndeterminate: boolean = false;
    selectedIds: string[] = [];

    @ViewChild('matCheckbox', {static: true}) matCheckbox: MatCheckbox;

    readonly utilsService = inject(UtilsService)

    checkAndUpdateSelect() {
      if (!this.selectedIds.length) {
        this.isIndeterminate = false;
        this.matCheckbox.checked = false;
      }

      if (this.selectedIds.length === this.allTableData.length) {
        this.isIndeterminate = false;
        this.matCheckbox.checked = true;
      }

      if (this.selectedIds.length && this.selectedIds.length !== this.allTableData.length) {
        this.isIndeterminate = true;
        this.matCheckbox.checked = true;
      }
    }

    checkSelectionData() {
      let isAllSelect = true;
      this.allTableData.forEach(m => {
        if (!m.select) {
          isAllSelect = false;
        }
      });

      this.matCheckbox.checked = isAllSelect;
    }

    onAllSelectChange(event: any) {
      const currentPageIds = this.allTableData.map(m => m._id);
      if (event.checked) {
        this.isIndeterminate = false;
        this.matCheckbox.checked = true;
        this.selectedIds = this.utilsService.mergeArrayString(this.selectedIds, currentPageIds)
        this.allTableData.forEach(m => {
          m.select = true;
        })
      } else {
        this.isIndeterminate = false;
        this.matCheckbox.checked = false;
        currentPageIds.forEach(m => {
          this.allTableData.find(f => f._id === m).select = false;
          const i = this.selectedIds.findIndex(f => f === m);
          this.selectedIds.splice(i, 1);
        })
      }
    }

    onCheckChange(event: any, id: string) {
      if (event) {
        this.selectedIds.push(id);
      } else {
        const i = this.selectedIds.findIndex(f => f === id);
        this.selectedIds.splice(i, 1);
      }

      this.checkAndUpdateSelect();
    }
    onClearSelection() {
      this.onAllSelectChange({checked: false});
    }
    onTableRowClick(id: string) {
      const fIndex = this.selectedIds.findIndex(f => f === id);
      const fThemeIndex = this.allTableData.findIndex(f => f._id === id);
      if (fIndex === -1) {
        this.selectedIds.push(id);
        this.allTableData[fThemeIndex].select = true;
      } else {
        const i = this.selectedIds.findIndex(f => f === id);
        this.selectedIds.splice(i, 1);
        this.allTableData[fThemeIndex].select = false;
      }
      this.checkAndUpdateSelect();
    }
  }

  return SelectableClass;
}
