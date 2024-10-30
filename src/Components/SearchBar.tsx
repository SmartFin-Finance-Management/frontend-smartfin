// src/Components/SearchBar.tsx
import React from 'react';
import { Input, Box } from '@chakra-ui/react';
import { IconButton } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"

const SearchBar: React.FC = () => (
  <Box className="search-bar" margin="1rem">
    <Input placeholder="Search for tailors near you..." size="lg" />
    <IconButton size="lg" aria-label="Search database" variant="ghost">
      <LuSearch />
    </IconButton>
  </Box>
);

export default SearchBar;
