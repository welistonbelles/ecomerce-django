from tabnanny import verbose
from unicodedata import category
from django.db import models
from stdimage.models import StdImageField

# SIGNALS
from django.db.models import signals
from django.template.defaultfilters import slugify

class Base(models.Model):
    created = models.DateField('Data de criação', auto_now_add=True)
    modified = models.DateField('Data de Atualização', auto_now=True)
    active = models.BooleanField('Ativo?', default=True)

    class Meta:
        abstract = True


class Category(Base):
    category = models.CharField('Categoria', max_length=100)

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
    
    def __str__(self):
        return self.category

class SubCategory(Base):
    category = models.ForeignKey('produtos.Category', verbose_name='Categoria', on_delete=models.CASCADE)
    subcategory = models.CharField('Sub-Categoria', max_length=100)

    class Meta:
        verbose_name = 'Sub-Categoria'
        verbose_name_plural = 'Sub-Categorias'
    
    def __str__(self):
        return self.subcategory

class Product(Base):

    name = models.CharField('Nome', max_length=100)
    category = models.ForeignKey('produtos.Category', verbose_name='Categoria', on_delete=models.CASCADE)
    subcategory = models.ForeignKey('produtos.SubCategory', verbose_name='SubCategoria', on_delete=models.CASCADE)
    price = models.DecimalField('Preço', max_digits=8, decimal_places=2)
    stock = models.IntegerField('Estoque')
    image = StdImageField('Imagem', upload_to='produtos', variations={'thumb': (124, 124)})
    slug = models.SlugField('Slug', max_length=100, blank=True, editable=False)

    class Meta:
        verbose_name = 'Produto'
        verbose_name_plural = 'Produtos'

    def __str__(self):
        return self.name

def produto_pre_save(signal, instance, sender, **kwargs):
    instance.slug = slugify(instance.name)

signals.pre_save.connect(produto_pre_save, sender=Product)