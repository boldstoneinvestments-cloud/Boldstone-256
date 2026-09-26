import os

from django.http import HttpResponseRedirect

from api.admin_two_factor import VERIFIED_SESSION_KEY, begin_admin_two_factor


class RequireAdminTwoFactorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if (
            request.path.startswith('/admin/')
            and request.user.is_authenticated
            and request.user.is_active
            and request.user.is_staff
            and not request.session.get(VERIFIED_SESSION_KEY)
        ):
            begin_admin_two_factor(request, request.user)
            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173').strip().rstrip('/')
            return HttpResponseRedirect(f'{frontend_url}/admin/sign-in?two_factor=required')
        return self.get_response(request)