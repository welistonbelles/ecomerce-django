class Cart:
    def __init__(self, request):
        if request.session.get('cart') is None:
            request.session['cart'] = {}

        self.cart = request.session['cart']
        self.session = request.session

    def add(self, product, amount=1, override=False):
        product_id = str(product.id)
        if product_id not in self.cart:
            self.cart[product_id] = {
                'id': product.id,
                'name': product.name,
                'image': str(product.image),
                'amount': 0,
                'baseprice': float(product.price),
                'price': product.price,
            }
        
        if override:
            self.cart[product_id]['amount'] = int(amount)
        else:
            self.cart[product_id]['amount'] += int(amount)
            
        self.cart[product_id]['price'] = round(float(self.cart[product_id]['amount']) * float(product.price), 2)

        self.session.modified = True

    def remove(self, id):
        print("linha 31")
        if str(id) in self.cart:
            print('To aqui')
            del self.cart[str(id)]
            self.session.modified = True

    def clean(self):
        if self.session.get('cart') != None:
            del self.session['cart']
            self.session.modified = True