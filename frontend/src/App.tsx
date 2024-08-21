import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import DataTable from 'react-data-table-component';
import { useForm, Controller } from 'react-hook-form';
import Modal from 'react-modal';
import { backend } from 'declarations/backend';

interface TaxPayer {
  tid: string;
  firstName: string;
  lastName: string;
  address: string;
}

const App: React.FC = () => {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<TaxPayer>();

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const fetchTaxPayers = async () => {
    setIsLoading(true);
    try {
      const result = await backend.getAllTaxPayers();
      setTaxPayers(result);
    } catch (error) {
      console.error('Error fetching tax payers:', error);
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const result = await backend.searchTaxPayers(searchTerm);
      setTaxPayers(result);
    } catch (error) {
      console.error('Error searching tax payers:', error);
    }
    setIsLoading(false);
  };

  const handleAddTaxPayer = async (data: TaxPayer) => {
    setIsLoading(true);
    try {
      await backend.addTaxPayer(data);
      setIsModalOpen(false);
      reset();
      fetchTaxPayers();
    } catch (error) {
      console.error('Error adding tax payer:', error);
    }
    setIsLoading(false);
  };

  const columns = [
    { name: 'TID', selector: (row: TaxPayer) => row.tid, sortable: true },
    { name: 'First Name', selector: (row: TaxPayer) => row.firstName, sortable: true },
    { name: 'Last Name', selector: (row: TaxPayer) => row.lastName, sortable: true },
    { name: 'Address', selector: (row: TaxPayer) => row.address, sortable: true },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          TaxPayer Management System
        </Typography>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            label="Search by TID"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" onClick={handleSearch} disabled={isLoading}>
            Search
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setIsModalOpen(true)}
            sx={{ ml: 2 }}
            disabled={isLoading}
          >
            Add New TaxPayer
          </Button>
        </Box>
        <DataTable
          columns={columns}
          data={taxPayers}
          pagination
          progressPending={isLoading}
        />
      </Box>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add New TaxPayer"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
          },
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Add New TaxPayer
        </Typography>
        <form onSubmit={handleSubmit(handleAddTaxPayer)}>
          <Controller
            name="tid"
            control={control}
            defaultValue=""
            rules={{ required: 'TID is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="TID"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            rules={{ required: 'First Name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="First Name"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            rules={{ required: 'Last Name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Last Name"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: 'Address is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Address"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
            Add TaxPayer
          </Button>
        </form>
      </Modal>
    </Container>
  );
};

export default App;
