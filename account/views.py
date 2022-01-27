from distutils.log import error
from django.urls import reverse_lazy
from django.views.generic import FormView
from django.urls import reverse_lazy
from django.contrib import messages

from .forms import CustomUserForm
from .models import CustomUser


class RegisterView(FormView):
    template_name = 'account/register.html'
    form_class = CustomUserForm
    success_url = reverse_lazy('login')

    def post(self, request, *args, **kwargs):
        form = self.get_form()

        if form.is_valid():
            if form.cleaned_data.get('email'):
                if CustomUser.objects.filter(email=form.cleaned_data['email']).exists():
                    messages.error(self.request, 'Este email já está cadastrado em nosso sistema.')
                    return super(RegisterView, self).form_invalid(form, *args, **kwargs)

            return self.form_valid(form)
        else:
            messages.error(self.request, form.errors)
            return self.form_invalid(form)

    def form_valid(self, form, *args, **kwargs):
        form.save()
        messages.success(self.request, 'Usuário criado com sucesso.')
        return super(RegisterView, self).form_valid(form, *args, **kwargs)
    
    def form_invalid(self, form, *args, **kwargs):
        if form.errors.get('password2'):
            form.errors['Confirmar senha'] = form.errors['password2']
            del form.errors['password2']
            
        return super(RegisterView, self).form_invalid(form, *args, **kwargs)