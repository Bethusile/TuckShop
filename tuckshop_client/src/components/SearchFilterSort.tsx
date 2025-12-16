// tuckshop_client/src/components/SearchFilterSort.tsx
import React from 'react';
import { 
    Box, 
    TextField, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Paper
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface FilterOption {
    value: string;
    label: string;
}

interface SortOption {
    value: string;
    label: string;
}

interface SearchFilterSortProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    
    filterValue?: string;
    onFilterChange?: (value: string) => void;
    filterLabel?: string;
    filterOptions?: FilterOption[];
    
    sortValue?: string;
    onSortChange?: (value: string) => void;
    sortLabel?: string;
    sortOptions?: SortOption[];
}

const SearchFilterSort: React.FC<SearchFilterSortProps> = ({
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    filterValue = '',
    onFilterChange,
    filterLabel = 'Filter',
    filterOptions = [],
    sortValue = '',
    onSortChange,
    sortLabel = 'Sort By',
    sortOptions = [],
}) => {
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    const handleFilterChange = (event: SelectChangeEvent) => {
        if (onFilterChange) {
            onFilterChange(event.target.value);
        }
    };

    const handleSortChange = (event: SelectChangeEvent) => {
        if (onSortChange) {
            onSortChange(event.target.value);
        }
    };

    return (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Search Bar */}
                <TextField
                    size="small"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={handleSearchChange}
                    sx={{ flexGrow: 1, minWidth: '200px' }}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                />

                {/* Filter Dropdown */}
                {filterOptions.length > 0 && onFilterChange && (
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>{filterLabel}</InputLabel>
                        <Select
                            value={filterValue}
                            label={filterLabel}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {filterOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {/* Sort Dropdown */}
                {sortOptions.length > 0 && onSortChange && (
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>{sortLabel}</InputLabel>
                        <Select
                            value={sortValue}
                            label={sortLabel}
                            onChange={handleSortChange}
                        >
                            {sortOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Box>
        </Paper>
    );
};

export default SearchFilterSort;
