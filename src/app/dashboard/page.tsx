'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  city: string;
  rating: number;
  open: boolean;
  createdAt: string;
}

type RestaurantFormData = {
  name: string;
  cuisine: string;
  city: string;
  rating: string;
  open: boolean;
};

const createEmptyFormData = (): RestaurantFormData => ({
  name: '',
  cuisine: '',
  city: '',
  rating: '',
  open: false,
});

const AUTH_TOKEN_KEY = 'authToken';

export default function DashboardPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState<Restaurant | null>(null);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState<RestaurantFormData>(() => createEmptyFormData());
  const [formError, setFormError] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    cuisine: '',
    city: '',
  });
  const [sortConfig, setSortConfig] = useState<{
    key: 'name' | 'rating' | null;
    direction: 'asc' | 'desc';
  }>({
    key: 'name',
    direction: 'asc',
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedRestaurants = localStorage.getItem('restaurants');

    if (!storedRestaurants) {
      const defaultRestaurants: Restaurant[] = [
        {
          id: 1,
          name: 'Sabor Italiano',
          cuisine: 'Italiana',
          city: 'São Paulo',
          rating: 4.5,
          open: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'Churrasco Gaúcho',
          cuisine: 'Brasileira',
          city: 'Porto Alegre',
          rating: 4.8,
          open: false,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('restaurants', JSON.stringify(defaultRestaurants));
      setRestaurants(defaultRestaurants);
    } else {
      setRestaurants(JSON.parse(storedRestaurants));
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem('username');
      // Não remove os restaurantes para persistência
    }
    router.push('/');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterInputChange = (field: 'name' | 'cuisine' | 'city') => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, open: checked }));
  };

  const handleSort = (key: 'name' | 'rating') => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }

      return {
        key,
        direction: 'asc',
      };
    });
  };

  const processedRestaurants = useMemo(() => {
    const normalizedName = filters.name.trim().toLowerCase();
    const normalizedCuisine = filters.cuisine.trim().toLowerCase();
    const normalizedCity = filters.city.trim().toLowerCase();

    const filtered = restaurants.filter((restaurant) => {
      const matchesName = restaurant.name.toLowerCase().includes(normalizedName);
      const matchesCuisine = restaurant.cuisine.toLowerCase().includes(normalizedCuisine);
      const matchesCity = restaurant.city.toLowerCase().includes(normalizedCity);

      return matchesName && matchesCuisine && matchesCity;
    });

    if (!sortConfig.key) {
      return filtered;
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortConfig.key === 'name') {
        const result = a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' });
        return sortConfig.direction === 'asc' ? result : -result;
      }

      if (sortConfig.key === 'rating') {
        const result = a.rating - b.rating;
        return sortConfig.direction === 'asc' ? result : -result;
      }

      return 0;
    });

    return sorted;
  }, [filters.city, filters.cuisine, filters.name, restaurants, sortConfig]);

  const getSortIndicator = (column: 'name' | 'rating') => {
    if (sortConfig.key !== column) {
      return null;
    }

    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const { name, cuisine, city, rating } = formData;

    if (!name || !cuisine || !city) {
      setFormError('Nome, cozinha e cidade são obrigatórios');
      return;
    }

    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      setFormError('A avaliação deve ser um número entre 0 e 5');
      return;
    }

    if (editingRestaurant) {
      const updatedRestaurants = restaurants.map((restaurant) =>
        restaurant.id === editingRestaurant.id
          ? { ...restaurant, name, cuisine, city, rating: ratingNum, open: formData.open }
          : restaurant,
      );

      setRestaurants(updatedRestaurants);
      if (typeof window !== 'undefined') {
        localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
      }
      toast.success('Restaurante atualizado com sucesso!');
    } else {
      const newRestaurant: Restaurant = {
        id: restaurants.length > 0 ? Math.max(...restaurants.map((r) => r.id)) + 1 : 1,
        name,
        cuisine,
        city,
        rating: ratingNum,
        open: formData.open,
        createdAt: new Date().toISOString(),
      };

      const updatedRestaurants = [...restaurants, newRestaurant];
      setRestaurants(updatedRestaurants);
      if (typeof window !== 'undefined') {
        localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
      }
      toast.success('Restaurante criado com sucesso!');
    }

    setFormData(createEmptyFormData());
    setEditingRestaurant(null);
    setOpenAddDialog(false);
  };

  const handleDelete = (id: number) => {
    const updatedRestaurants = restaurants.filter((restaurant) => restaurant.id !== id);
    setRestaurants(updatedRestaurants);
    if (typeof window !== 'undefined') {
      localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
    }
    setOpenDeleteDialog(false);
    setRestaurantToDelete(null);
    toast.success('Restaurante excluído com sucesso!');
  };

  const startEditing = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      city: restaurant.city,
      rating: restaurant.rating.toString(),
      open: restaurant.open,
    });
    setFormError('');
    setOpenAddDialog(true);
  };

  const openDeleteConfirmation = (restaurant: Restaurant) => {
    setRestaurantToDelete(restaurant);
    setOpenDeleteDialog(true);
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-4xl sm:max-w-5xl lg:max-w-6xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">Bem-vindo ao Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <p className="text-center mb-4 sm:mb-6 text-sm sm:text-base">
              Você está logado como {typeof window !== 'undefined' ? localStorage.getItem('username') : ''}!
            </p>
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold">Restaurantes Cadastrados</h2>
                <Dialog
                  open={openAddDialog}
                  onOpenChange={(open) => {
                    setOpenAddDialog(open);
                    if (!open) {
                      setFormData(createEmptyFormData());
                      setFormError('');
                      setEditingRestaurant(null);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingRestaurant(null);
                        setFormData(createEmptyFormData());
                        setFormError('');
                      }}
                      className="text-sm sm:text-base"
                    >
                      <FaPlus className="mr-2 h-4 w-4" />
                      Adicionar Restaurante
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl">
                        {editingRestaurant ? 'Editar Restaurante' : 'Adicionar Novo Restaurante'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          placeholder="Digite o nome do restaurante"
                          required
                          className="text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cuisine">Cozinha</Label>
                        <Input
                          id="cuisine"
                          name="cuisine"
                          value={formData.cuisine}
                          onChange={handleFormChange}
                          placeholder="Digite o tipo de cozinha"
                          required
                          className="text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleFormChange}
                          placeholder="Digite a cidade"
                          required
                          className="text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">Avaliação (0–5)</Label>
                        <Input
                          id="rating"
                          name="rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={formData.rating}
                          onChange={handleFormChange}
                          placeholder="Digite a avaliação"
                          required
                          className="text-sm sm:text-base"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="open"
                          checked={formData.open}
                          onCheckedChange={handleCheckboxChange}
                        />
                        <Label htmlFor="open">Aberto</Label>
                      </div>
                      {formError && <p className="text-red-500 text-xs sm:text-sm">{formError}</p>}
                      <Button type="submit" className="w-full text-sm sm:text-base">
                        {editingRestaurant ? 'Salvar alterações' : 'Salvar'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid gap-4 mb-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col">
                  <Label htmlFor="filter-name">Buscar por nome</Label>
                  <Input
                    id="filter-name"
                    placeholder="Digite o nome"
                    value={filters.name}
                    onChange={handleFilterInputChange('name')}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="filter-cuisine">Filtrar por cozinha</Label>
                  <Input
                    id="filter-cuisine"
                    placeholder="Digite o tipo de cozinha"
                    value={filters.cuisine}
                    onChange={handleFilterInputChange('cuisine')}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="filter-city">Filtrar por cidade</Label>
                  <Input
                    id="filter-city"
                    placeholder="Digite a cidade"
                    value={filters.city}
                    onChange={handleFilterInputChange('city')}
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">ID</TableHead>
                      <TableHead>
                        <button
                          type="button"
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-1 font-semibold text-left text-xs sm:text-sm"
                        >
                          Nome
                          {getSortIndicator('name') && (
                            <span className="text-xs">{getSortIndicator('name')}</span>
                          )}
                        </button>
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">Cozinha</TableHead>
                      <TableHead className="text-xs sm:text-sm">Cidade</TableHead>
                      <TableHead>
                        <button
                          type="button"
                          onClick={() => handleSort('rating')}
                          className="flex items-center gap-1 font-semibold text-left text-xs sm:text-sm"
                        >
                          Avaliação
                          {getSortIndicator('rating') && (
                            <span className="text-xs">{getSortIndicator('rating')}</span>
                          )}
                        </button>
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-xs sm:text-sm">Criado em</TableHead>
                      <TableHead className="text-xs sm:text-sm">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedRestaurants.map((restaurant) => (
                      <TableRow key={restaurant.id}>
                        <TableCell className="text-xs sm:text-sm">{restaurant.id}</TableCell>
                        <TableCell className="font-medium text-xs sm:text-sm">{restaurant.name}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{restaurant.cuisine}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{restaurant.city}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{restaurant.rating}/5</TableCell>
                        <TableCell>
                          <Badge variant={restaurant.open ? 'default' : 'secondary'} className="text-xs sm:text-sm">
                            {restaurant.open ? 'Aberto' : 'Fechado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {new Date(restaurant.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditing(restaurant)}
                            >
                              <FaEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteConfirmation(restaurant)}
                            >
                              <FaTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <Dialog
              open={openDeleteDialog}
              onOpenChange={(open) => {
                setOpenDeleteDialog(open);
                if (!open) {
                  setRestaurantToDelete(null);
                }
              }}
            >
              <DialogContent className="max-w-[90vw] sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Confirmar Exclusão</DialogTitle>
                </DialogHeader>
                <p className="text-sm sm:text-base">
                  Tem certeza que deseja excluir o restaurante{' '}
                  <span className="font-semibold">{restaurantToDelete?.name}</span>?
                </p>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setOpenDeleteDialog(false)} className="text-sm sm:text-base">
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => restaurantToDelete && handleDelete(restaurantToDelete.id)}
                    className="text-sm sm:text-base"
                  >
                    Excluir
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={handleLogout} className="w-full text-sm sm:text-base">
              Sair
            </Button>
          </CardContent>
        </Card>
      </div>
  );
}