"""
Django storage backend for Vercel Blob.

Vercel's serverless functions have no persistent filesystem, so uploaded
player photos and payment screenshots are stored in Vercel Blob instead.
Uses the synchronous API since Django's storage interface (and the views
that call it) are synchronous.

Credentials come from BLOB_READ_WRITE_TOKEN, set automatically once a
Blob store is connected to the Vercel project.
"""

import mimetypes

from django.core.files.base import ContentFile
from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible
from vercel.blob import sync as blob


@deconstructible
class VercelBlobStorage(Storage):
    def _save(self, name, content):
        content.seek(0)
        data = content.read()
        content_type = (
            getattr(content, 'content_type', None)
            or mimetypes.guess_type(name)[0]
            or 'application/octet-stream'
        )
        result = blob.put_blob(
            name,
            data,
            access='public',
            content_type=content_type,
            add_random_suffix=True,
        )
        # Store the full delivery URL as the "name" — head_blob/get_blob/
        # delete_blob all accept a delivery URL in place of a pathname, so
        # later storage operations on this file keep working unchanged.
        return result.url

    def _open(self, name, mode='rb'):
        result = blob.get_blob(name, access='public')
        return ContentFile(result.body, name=name)

    def exists(self, name):
        # Uniqueness is handled by add_random_suffix in _save, so Django's
        # get_available_name() shouldn't try to dedupe the name itself.
        return False

    def url(self, name):
        return name

    def size(self, name):
        return blob.head_blob(name).size

    def delete(self, name):
        try:
            blob.delete_blob(name)
        except blob.BlobNotFoundError:
            pass
