import type { KeyOfLoose } from '<project-name>-types';
import type { DropdownMenuItem, TableColumn, TableData } from '@nuxt/ui';
import type { Row } from '@tanstack/vue-table';
import type { Component } from 'vue';
import type { DateTimeOptions } from 'vue-i18n';
import type { RouteLocationRaw } from 'vue-router';
import UButton from '@nuxt/ui/components/Button.vue';
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

export interface UseTableComposable<T extends TableData> {
  /**
   * Creates a cell of data that can be used to link to another page.
   * @param accessorKey The key of the input table to display.
   * @param to A function that returns a vue router location.
   * @returns A function that can be used for defining the link cell.
   */
  linkCell: (
    accessorKey: KeyOfLoose<T>,
    to: (row: Row<T>) => RouteLocationRaw,
  ) => TableColumn<T>['cell'];

  /**
   * Creates a cell of data for displaying a date-time.
   * @param accessorKey The key of the input table to display.
   * @param options Options for how to display the date-time.
   * @returns A functions that can be used for defining the date cell.
   */
  dateCell: (
    accessorKey: KeyOfLoose<T>,
    options?: DateTimeOptions,
  ) => ({ row }: { row: Row<T> }) => string;

  /**
   * Create a column header that can be sorted on click.
   * @param label The label for the sortable column.
   * @param multiSort Whether to allow the column to be multi-sorted.
   * @returns A function that can be used for defining the column header.
   */
  sortableColumn: (label: string, multiSort?: boolean) => TableColumn<T>['header'];

  /**
   * Create a cell which when clicked renders a UDropdownMenu with the input items.
   * @param dropdownItems A function that returns an array of items to display in the dropdown.
   * @returns A function that can be used for defining the table column.
   */
  actionsCell: (
    dropdownItems: (row: Row<T>) => DropdownMenuItem[] | DropdownMenuItem[][],
  ) => TableColumn<T>['cell'];
}

export const useTable = <T extends TableData>(dataTestid: string): UseTableComposable<T> => {
  const { d } = useI18n();

  const linkCell
    = (accessorKey: KeyOfLoose<T>, to: (row: Row<T>) => RouteLocationRaw): TableColumn<T>['cell'] =>
      ({ row }) => {
        return h(
          RouterLink,
          {
            'to': to(row),
            'class': 'text-primary-500 hover:text-primary-600 dark:hover:text-primary-400',
            'data-testid': `${dataTestid}:${accessorKey as string}:${row.id}`,
          },
          () => row.getValue(String(accessorKey)),
        );
      };

  const dateCell
    = (accessorKey: KeyOfLoose<T>, options: DateTimeOptions = {}) =>
      ({ row }: { row: Row<T> }) => {
        const value = row.original[accessorKey as keyof T];

        if (!value) {
          return '';
        }

        if (typeof value !== 'string') {
          return '';
        }

        return d(value, options);
      };

  const sortableColumn
    = (label: string, multiSort = false): TableColumn<T>['header'] =>
      ({ column }) => {
        const isSorted = column.getIsSorted();
        let onClick;
        let icon;

        switch (isSorted) {
          case 'asc':
            onClick = () => column.toggleSorting(true, multiSort);
            icon = 'i-lucide-arrow-up-narrow-wide';
            break;
          case 'desc': {
            onClick = () => column.clearSorting();
            icon = 'i-lucide-arrow-down-wide-narrow';
            break;
          }
          default: {
            onClick = () => column.toggleSorting(false, multiSort);
            icon = 'i-lucide-arrow-up-down';
          }
        }

        return h(UButton, {
          'color': 'neutral',
          'variant': 'ghost',
          'class': '-mx-2.5',
          label,
          icon,
          'data-testid': `${dataTestid}:sort:${column.id}`,
          'data-sort': isSorted,
          onClick,
        });
      };

  const actionsCell
    = (
      dropdownItems: (row: Row<T>) => DropdownMenuItem[] | DropdownMenuItem[][],
    ): TableColumn<T>['cell'] =>
      ({ row }) => {
        return h(
          'div',
          { class: 'text-right' },
          h(
            UDropdownMenu as Component,
            {
              'content': {
                align: 'end',
              },
              'items': dropdownItems(row),
              'aria-label': 'Actions dropdown',
            },
            () =>
              h(UButton, {
                'icon': 'i-lucide-ellipsis-vertical',
                'color': 'neutral',
                'variant': 'ghost',
                'class': 'ml-auto',
                'aria-label': 'Actions dropdown',
                'data-testid': `${dataTestid}:actions:${row.id}`,
              }),
          ),
        );
      };

  return { linkCell, sortableColumn, actionsCell, dateCell };
};
