import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

export function StoreFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="font-bold text-primary-foreground">P</span>
              </div>
              <span className="text-lg font-bold">PharmaCare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted online pharmacy for all your health and wellness needs. Licensed and verified.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/prescriptions" className="text-muted-foreground hover:text-primary">
                  Upload Prescription
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-muted-foreground hover:text-primary">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop?category=vitamins" className="text-muted-foreground hover:text-primary">
                  Vitamins & Supplements
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pain-relief" className="text-muted-foreground hover:text-primary">
                  Pain Relief
                </Link>
              </li>
              <li>
                <Link href="/shop?category=first-aid" className="text-muted-foreground hover:text-primary">
                  First Aid
                </Link>
              </li>
              <li>
                <Link href="/shop?category=personal-care" className="text-muted-foreground hover:text-primary">
                  Personal Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>1-800-PHARMA</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@pharmacare.com</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4" />
                <span>123 Health Street, Medical City, MC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PharmaCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
