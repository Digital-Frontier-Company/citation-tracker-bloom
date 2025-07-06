import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeOption } from "@/types/dashboard";

interface DateRangeFilterProps {
  value: DateRangeOption;
  onChange: (value: DateRangeOption) => void;
}

const dateRangeOptions = [
  { value: "last_7_days" as const, label: "Last 7 days" },
  { value: "last_30_days" as const, label: "Last 30 days" },
  { value: "last_90_days" as const, label: "Last 90 days" },
  { value: "last_year" as const, label: "Last year" },
];

export const DateRangeFilter = ({ value, onChange }: DateRangeFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40 bg-background border-border">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {dateRangeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};