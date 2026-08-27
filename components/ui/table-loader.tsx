// components/ui/table-loader.tsx

import { Loader } from './loader';

type Props = {
  columns: number;
};

export function TableLoader({ columns }: Props) {
  return (
    <tr>
      <td colSpan={columns} className="py-10">
        <Loader text="Fetching records..." />
      </td>
    </tr>
  );
}
