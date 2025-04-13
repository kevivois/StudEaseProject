import { SelectChangeEvent, OutlinedInput, MenuItem, Chip, Select, Box, InputLabel, FormControl } from "@mui/material";
import { useState } from "react";

interface OptionType {
  value: string;
  label: string;
}

interface CustomSelectProps {
  onChange: (arr:string[]) => void;
  defaultOptions: OptionType[];
}

export default function CustomSelect({ onChange, defaultOptions }: CustomSelectProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const arrayValue = typeof value === "string" ? value.split(",") : value;
    setSelected(arrayValue);
    // Création d'un objet mimant un input event pour correspondre à ton handler
    onChange(arrayValue)
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Jours et horaires</InputLabel>
      <Select
        multiple
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput label="Jours et horaires" />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {defaultOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
