from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomUserForm(UserCreationForm):

    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name')
        labels = {'username': 'Username/E-mail'}

    email = forms.EmailField(label="E-mail", max_length=100)
    first_name = forms.CharField(label="Nome", max_length=100)
    last_name = forms.CharField(label="Sobrenome", max_length=100)

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        user.username = self.cleaned_data['email']
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']

        if commit:
            user.save()
        return user
        
    def create_user(self):
        print(self.cleaned_data)

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ()
        fields = ('first_name', 'last_name')