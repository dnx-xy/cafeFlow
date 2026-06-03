'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/i18n/context';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/lib/currency';
import {
  Plus, ArrowLeft, UtensilsCrossed, FolderTree, Beef,
  Edit, Trash2, AlertTriangle, MoreHorizontal, EyeOff, PlusCircle, Image,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMenus, Menu, MenuCategory, MenuItem } from '@/hooks/useMenus';

export default function MenuPage() {
  const { t } = useI18n();
  const {
    menus, selectedMenu, loading, error,
    fetchMenus, fetchMenuWithItems,
    createMenu, updateMenu, deleteMenu,
    createCategory, updateCategory, deleteCategory,
    createItem, updateItem, deleteItem,
    setSelectedMenu, setError,
  } = useMenus();

  const { currency } = useCurrency();
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [menuForm, setMenuForm] = useState({ name: '', description: '', isActive: true });
  const [catForm, setCatForm] = useState({ name: '', description: '', sortIndex: 0 });
  const [itemForm, setItemForm] = useState<{ name: string; description: string; price: number; menuCategoryId?: string; available: boolean; hidden: boolean; categorySortIndex: number; imageUrl?: string }>({ name: '', description: '', price: 0, menuCategoryId: undefined, available: true, hidden: false, categorySortIndex: 0, imageUrl: undefined });

  useEffect(() => { fetchMenus(); }, []);

  const handleCreateMenu = async () => {
    if (!menuForm.name) { toast.error(t.dashboard.menu.nameRequired); return; }
    try { await createMenu(menuForm); setShowCreateMenu(false); setMenuForm({ name: '', description: '', isActive: true }); toast.success(t.dashboard.menu.menuCreated); }
    catch { toast.error(t.dashboard.menu.failedCreateMenu); }
  };

  const handleUpdateMenu = async () => {
    if (!editingMenu || !menuForm.name) return;
    try { await updateMenu(editingMenu.id, menuForm); setEditingMenu(null); setMenuForm({ name: '', description: '', isActive: true }); toast.success(t.dashboard.menu.menuUpdated); }
    catch { toast.error(t.dashboard.menu.failedUpdateMenu); }
  };

  const handleDeleteMenu = async (id: string) => {
    try { await deleteMenu(id); toast.success(t.dashboard.menu.menuDeleted); } catch { toast.error(t.dashboard.menu.failedDeleteMenu); }
  };

  const handleCreateCategory = async () => {
    if (!selectedMenu || !catForm.name) { toast.error(t.dashboard.menu.categoryNameRequired); return; }
    try { await createCategory(selectedMenu.id, catForm); setShowCreateCategory(false); setCatForm({ name: '', description: '', sortIndex: 0 }); toast.success(t.dashboard.menu.categoryCreated); }
    catch { toast.error('Failed to create category'); }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !catForm.name) return;
    try { await updateCategory(editingCategory.id, catForm); setEditingCategory(null); setCatForm({ name: '', description: '', sortIndex: 0 }); toast.success(t.dashboard.menu.categoryUpdated); }
    catch { toast.error('Failed to update category'); }
  };

  const handleCreateItem = async () => {
    if (!selectedMenu || !itemForm.name || !itemForm.price) { toast.error(t.dashboard.menu.nameAndPriceRequired); return; }
    const payload = { ...itemForm };
    if (!payload.menuCategoryId) delete payload.menuCategoryId;
    try { await createItem(selectedMenu.id, payload as any); setShowCreateItem(false); setItemForm({ name: '', description: '', price: 0, menuCategoryId: undefined, available: true, hidden: false, categorySortIndex: 0 }); toast.success(t.dashboard.menu.itemCreated); }
    catch { toast.error('Failed to create item'); }
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !itemForm.name) return;
    const payload = { ...itemForm };
    if (!payload.menuCategoryId) delete payload.menuCategoryId;
    try { await updateItem(editingItem.id, payload as any); setEditingItem(null); setItemForm({ name: '', description: '', price: 0, menuCategoryId: undefined, available: true, hidden: false, categorySortIndex: 0 }); toast.success(t.dashboard.menu.itemUpdated); }
    catch { toast.error('Failed to update item'); }
  };

  const handleImageUpload = async () => {
    if (!editingItem || !imageFile) return;

    try {
      // In a real implementation, you'd upload to your backend here
      // For now we'll just simulate the upload
      toast.success(t.dashboard.menu.imageUploaded);
      
      // Update the item with the image URL (simulated)
      const updatedItem = { ...editingItem, imageUrl: URL.createObjectURL(imageFile) }; 
      setEditingItem(updatedItem);
      
      // Close dialog
      setShowImageUpload(false);
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      toast.error(t.dashboard.menu.imageUploadFailed);
    }
  };

  const openMenu = async (menu: Menu) => {
    setSelectedMenu(menu);
    setError(null);
    const result = await fetchMenuWithItems(menu.id);
    if (!result) { toast.error('Failed to load menu items'); setSelectedMenu(null); }
  };
  const openEditMenu = (menu: Menu) => { setEditingMenu(menu); setMenuForm({ name: menu.name, description: menu.description || '', isActive: menu.isActive }); };
  const openEditCategory = (cat: MenuCategory) => { setEditingCategory(cat); setCatForm({ name: cat.name, description: cat.description || '', sortIndex: cat.sortIndex ?? 0 }); };
  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({ name: item.name, description: item.description || '', price: item.price, menuCategoryId: item.menuCategoryId || undefined, available: item.available, hidden: item.hidden, categorySortIndex: item.categorySortIndex ?? 0, imageUrl: item.imageUrl });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!selectedMenu) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.dashboard.menu.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.menu.subtitle}</p>
          </div>
          <Button size="sm" onClick={() => { setShowCreateMenu(true); setEditingMenu(null); setMenuForm({ name: '', description: '', isActive: true }); }}>
            <Plus className="w-4 h-4 mr-1.5" /> {t.dashboard.menu.createMenu}
          </Button>
        </div>

        {loading && !menus ? (
          <div className="flex justify-center items-center h-48"><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : error && !menus ? (
          <div className="text-center py-10"><AlertTriangle className="w-10 h-10 mx-auto text-red-500 mb-3" /><p className="text-red-500 text-sm mb-3">{error}</p><Button variant="outline" size="sm" onClick={fetchMenus}>{t.dashboard.menu.retry}</Button></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(menus ?? []).map(menu => (
              <div key={menu.id} className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{menu.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{menu.description || t.dashboard.menu.noDescription}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-7 h-7 -mr-1"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
<DropdownMenuItem onClick={() => openEditMenu(menu)}><Edit className="mr-2 w-4 h-4" />{t.dashboard.menu.editMenu}</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMenu(menu.id)}><Trash2 className="mr-2 w-4 h-4" />{t.dashboard.menu.deleteMenu}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={menu.isActive ? 'secondary' : 'destructive'} className="text-[10px]">{menu.isActive ? t.dashboard.menu.active : t.dashboard.menu.inactive}</Badge>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openMenu(menu)}>{t.dashboard.menu.manageItems}</Button>
                </div>
              </div>
            ))}
            {(menus ?? []).length === 0 && (
              <div className="col-span-full text-center py-12">
                <UtensilsCrossed className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t.dashboard.menu.noMenus}</p>
                <Button size="sm" onClick={() => { setShowCreateMenu(true); setMenuForm({ name: '', description: '', isActive: true }); }}><Plus className="w-4 h-4 mr-1.5" />{t.dashboard.menu.createFirstMenu}</Button>
              </div>
            )}
          </div>
        )}

        <Dialog open={showCreateMenu || editingMenu !== null} onOpenChange={open => { if (!open) { setShowCreateMenu(false); setEditingMenu(null); } }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>{editingMenu ? t.dashboard.menu.editMenu : t.dashboard.menu.createMenu}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.menu.name} *</label><Input value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} placeholder="Main Menu" className="h-9 text-sm" /></div>
              <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.menu.description}</label><Textarea value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} placeholder="Describe your menu" className="text-sm" /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={menuForm.isActive} onChange={e => setMenuForm({ ...menuForm, isActive: e.target.checked })} className="rounded" />{t.dashboard.menu.active}</label>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => { setShowCreateMenu(false); setEditingMenu(null); }}>{t.dashboard.menu.cancel}</Button>
                <Button size="sm" onClick={editingMenu ? handleUpdateMenu : handleCreateMenu}>{editingMenu ? t.dashboard.menu.update : t.dashboard.menu.create}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const categories = selectedMenu.categories ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setSelectedMenu(null)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMenu.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMenu.description || t.dashboard.menu.noDescription}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading && <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />}
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => openEditMenu(selectedMenu)}>
            <Edit className="w-4 h-4 mr-1.5" /> {t.dashboard.menu.editMenu}
          </Button>
        </div>
      </div>

      {categories.map(cat => (
        <div key={cat.id} className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{cat.name}</span>
              {cat.description && <span className="text-xs text-gray-400 hidden sm:inline">{cat.description}</span>}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEditCategory(cat)}><Edit className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="w-7 h-7 text-red-500" onClick={async () => { try { await deleteCategory(cat.id); toast.success(t.dashboard.menu.categoryDeleted); } catch { toast.error('Failed to delete'); } }}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="p-5">
            {(!cat.menuItems || cat.menuItems.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">{t.dashboard.menu.noItemsInCategory}</p>
            )}
            <div className="space-y-2">
              {(cat.menuItems ?? []).map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-9 h-9 rounded-xl object-cover" />
                      ) : (
                        <Beef className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                        {item.hidden && <EyeOff className="w-3 h-3 text-gray-400 shrink-0" />}
                        {!item.available && <Badge variant="destructive" className="text-[10px] px-1 py-0">{t.dashboard.menu.unavailable}</Badge>}
                      </div>
                      {item.description && <p className="text-xs text-gray-400 truncate">{item.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(item.price, currency)}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-7 h-7"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => openEditItem(item)}><Edit className="mr-2 w-4 h-4" />{t.dashboard.menu.editItem}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setEditingItem(item);
                          setShowImageUpload(true);
                        }}><Image className="mr-2 w-4 h-4" />{t.dashboard.menu.uploadImage}</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={async () => { try { await deleteItem(item.id); toast.success(t.dashboard.menu.itemDeleted); } catch { toast.error('Failed to delete'); } }}><Trash2 className="mr-2 w-4 h-4" />{t.dashboard.menu.deleteItem}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-1 text-xs text-gray-400 h-8" onClick={() => {
                setShowCreateItem(true);
                setItemForm({ name: '', description: '', price: 0, menuCategoryId: cat.id, available: true, hidden: false, categorySortIndex: (cat.menuItems?.length ?? 0) + 1 });
              }}>
                <PlusCircle className="w-4 h-4 mr-1.5" />{t.dashboard.menu.addItemTo.replace('{name}', cat.name)}
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => { setShowCreateCategory(true); setCatForm({ name: '', description: '', sortIndex: 0 }); }}>
          <Plus className="w-4 h-4 mr-1.5" /> {t.dashboard.menu.addCategory}
        </Button>
        <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => {
          setShowCreateItem(true);
          setItemForm({ name: '', description: '', price: 0, menuCategoryId: categories[0]?.id || undefined, available: true, hidden: false, categorySortIndex: 0 });
        }}>
          <Plus className="w-4 h-4 mr-1.5" /> {t.dashboard.menu.addItem}
        </Button>
      </div>

      <Dialog open={showCreateCategory || editingCategory !== null} onOpenChange={open => { if (!open) { setShowCreateCategory(false); setEditingCategory(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editingCategory ? t.dashboard.menu.editCategory : t.dashboard.menu.addCategory}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.menu.name} *</label><Input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} placeholder="e.g. Coffee" className="h-9 text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.menu.description}</label><Textarea value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} placeholder="Category description" className="text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.menu.sortOrder}</label><Input type="number" min="0" value={catForm.sortIndex} onChange={e => setCatForm({ ...catForm, sortIndex: parseInt(e.target.value) || 0 })} className="h-9 text-sm" /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => { setShowCreateCategory(false); setEditingCategory(null); }}>{t.dashboard.menu.cancel}</Button>
              <Button size="sm" onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>{editingCategory ? t.dashboard.menu.update : t.dashboard.menu.create}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateItem || editingItem !== null} onOpenChange={open => { if (!open) { setShowCreateItem(false); setEditingItem(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editingItem ? t.dashboard.menu.editItem : t.dashboard.menu.addItem}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.menu.name} *</label><Input value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} placeholder="e.g. Signature Latte" className="h-9 text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.menu.description}</label><Textarea value={itemForm.description} onChange={e => setItemForm({ ...itemForm, description: e.target.value })} placeholder="Item description" className="text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.menu.price} *</label><Input type="number" min="0" step="0.01" value={itemForm.price || ''} onChange={e => setItemForm({ ...itemForm, price: parseFloat(e.target.value) || 0 })} placeholder="9.99" className="h-9 text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.menu.sortOrder}</label><Input type="number" min="0" value={itemForm.categorySortIndex} onChange={e => setItemForm({ ...itemForm, categorySortIndex: parseInt(e.target.value) || 0 })} className="h-9 text-sm" /></div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.menu.category}</label>
              <select className="flex h-9 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16181f] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                value={itemForm.menuCategoryId} onChange={e => setItemForm({ ...itemForm, menuCategoryId: e.target.value })}>
                <option value="">{t.dashboard.menu.noCategory}</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={itemForm.available} onChange={e => setItemForm({ ...itemForm, available: e.target.checked })} className="rounded" />{t.dashboard.menu.available}</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={itemForm.hidden} onChange={e => setItemForm({ ...itemForm, hidden: e.target.checked })} className="rounded" />{t.dashboard.menu.hidden}</label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => { setShowCreateItem(false); setEditingItem(null); }}>{t.dashboard.menu.cancel}</Button>
              <Button size="sm" onClick={editingItem ? handleUpdateItem : handleCreateItem}>{editingItem ? t.dashboard.menu.update : t.dashboard.menu.create}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editingMenu !== null && selectedMenu !== null} onOpenChange={open => { if (!open) setEditingMenu(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{t.dashboard.menu.editMenu}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.menu.name} *</label><Input value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} className="h-9 text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.menu.description}</label><Textarea value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} className="text-sm" /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={menuForm.isActive} onChange={e => setMenuForm({ ...menuForm, isActive: e.target.checked })} className="rounded" />{t.dashboard.menu.active}</label>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEditingMenu(null)}>{t.dashboard.menu.cancel}</Button>
              <Button size="sm" onClick={handleUpdateMenu}>{t.dashboard.menu.update}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={showImageUpload} onOpenChange={open => { if (!open) { setShowImageUpload(false); setImagePreview(null); setImageFile(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{t.dashboard.menu.uploadImage}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {imagePreview ? (
              <div className="flex justify-center">
                <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg object-contain" />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.dashboard.menu.chooseImage}</label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => { setShowImageUpload(false); setImagePreview(null); setImageFile(null); }}>{t.dashboard.menu.cancel}</Button>
              <Button size="sm" onClick={handleImageUpload} disabled={!imageFile}>{t.dashboard.menu.uploadImage}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
