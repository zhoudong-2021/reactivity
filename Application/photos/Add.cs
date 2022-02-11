using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public handler(DataContext context, IPhotoAccessor photoAccessor,
            IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _photoAccessor = photoAccessor;
            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(x => x.Photos)
                            .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                if (user == null) return null;

                var uploadPhotoResult = _photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Id = uploadPhotoResult.Result.PublicId,
                    Url = uploadPhotoResult.Result.Url
                };

                if(!user.Photos.Any(x => x.IsMain)) photo.IsMain = true;

                user.Photos.Add(photo);

                var result = await _context.SaveChangesAsync() > 0;
                if(result) return Result<Photo>.Success(photo);
                return Result<Photo>.Failure("Unable to upload photo!");
            }
        }
    }
}