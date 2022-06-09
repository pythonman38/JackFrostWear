using System;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CartController : BaseApiController
    {
        private readonly StoreContext _context;
        public CartController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetCart")]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var cart = await RetrieveCart();

            if (cart == null) return NotFound();
            return MapCartToDto(cart);
        }

        [HttpPost]
        public async Task<ActionResult<CartDto>> AddItemToCart(int productId, int quantity)
        {
            var cart = await RetrieveCart();
            if (cart == null) cart = CreateCart();

            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound();
            cart.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtRoute("GetCart", MapCartToDto(cart));
            
            return BadRequest(new ProblemDetails{Title = "Problem saving item to shopping cart!"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveCartItem(int productId, int quantity)
        {
            var cart = await RetrieveCart();

            if (cart == null) return NotFound();

            cart.RemoveItem(productId, quantity);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails{Title = "Problem removing item from the shopping cart!"});
        }

        private async Task<Cart> RetrieveCart()
        {
            return await _context.Carts
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private Cart CreateCart()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            var cart = new Cart { BuyerId = buyerId };
            _context.Carts.Add(cart);

            return cart;
        }

           private CartDto MapCartToDto(Cart cart)
        {
            return new CartDto
            {
                Id = cart.Id,
                BuyerId = cart.BuyerId,
                Items = cart.Items.Select(item => new CartItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }
    }
}