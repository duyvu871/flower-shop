const adminApiRoutes = {
    // Admin
    admin: {
        login: '/admin/login',
        logout: '/admin/logout',
        getAdminInfo: '/admin/info',
        changePassword: '/admin/change-password',
        updateAdminInfo: '/admin/update-info',
    },
    // User
    user: {
        getAllUsers: '/api/v1/admin/users',
        getUserById: '/api/v1/admin/users/:id',
        createUser: '/api/v1/admin/users',
        updateUser: '/api/v1/admin/users/:id',
        deleteUser: (id: string) => '/api/v1/admin/users?id='+id,
    },
    // Category
    category: {
        getAllCategories: '/api/v1/admin/categories',
        getCategoryById: (id: string) => '/api/v1/admin/categories?id=' + id,
        createCategory: '/api/v1/admin/categories',
        updateCategory: '/api/v1/admin/categories',
        deleteCategory: (id: string) => '/api/v1/admin/categories?id='+id,
    },
    // Product
    product: {
        getAllProducts: '/api/v1/admin/products?type=all',
        getProductById: (id: string) => '/api/v1/admin/products?id=' + id,
        createProduct: '/api/v1/admin/products',
        updateProduct: '/api/v1/admin/products',
        deleteProduct: (id: string) => '/api/v1/admin/products?id='+id,
    },
}