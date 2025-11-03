// Helper function to get main image (backward compatibility)
function getMainImage(product) {
    return Array.isArray(product.images) ? product.images[0] : product.image;
}

// Database sản phẩm vợt cầu lông
const productsData = {
    yonex: [
        {
            id: "Y001-3U",
            name: "Yonex Astrox 100ZZ",
            brand: "Yonex",
            price: 4500000,
            originalPrice: 5200000,
            images: [
                "img/Yonex/astrox100zz_kurenai.webp",
                "img/Yonex/ax100zz-01-03.webp",
                "img/Yonex/ax100zz-05.webp",
                "img/Yonex/ax100zz-06.webp",
                "img/Yonex/ax100zz-07.webp",
                "img/Yonex/az100zz-08.webp"
            ],
            description: "Vợt tấn công mạnh mẽ, công nghệ Rotational Generator System. Phiên bản 3U (88g) cho lực smash cực mạnh.",
            weight: "3U",
            weightGrams: 88,
            balance: "Nặng đầu",
            flexibility: "Siêu Cứng",
            maxTension: "30 lbs",
            madeIn: "Japan",
            category: "Tấn công",
            rating: 4.9
        },
        {
            id: "Y001-4U",
            name: "Yonex Astrox 100ZZ",
            brand: "Yonex",
            price: 4500000,
            originalPrice: 5200000,
            images: [
                "img/Yonex/astrox100zz_kurenai.webp",
                "img/Yonex/ax100zz-01-03.webp",
                "img/Yonex/ax100zz-05.webp",
                "img/Yonex/ax100zz-06.webp",
                "img/Yonex/ax100zz-07.webp",
                "img/Yonex/az100zz-08.webp"
            ],
            description: "Vợt tấn công mạnh mẽ. Phiên bản 4U (83g) cân bằng giữa lực và tốc độ.",
            weight: "4U",
            weightGrams: 83,
            balance: "Nặng đầu",
            flexibility: "Siêu Cứng",
            maxTension: "30 lbs",
            madeIn: "Japan",
            category: "Tấn công",
            rating: 4.9
        },
        {
            id: "Y002-4U",
            name: "Yonex Arcsaber 11 Pro",
            brand: "Yonex",
            price: 4200000,
            originalPrice: 4800000,
            images: [
                "img/Yonex/arc11-main.webp",
                "img/Yonex/arc11-stick2.webp",
                "img/Yonex/arc11-stickwebp.webp",
                "img/Yonex/arc11-stick3.webp"
            ],
            description: "Vợt cân bằng hoàn hảo giữa tấn công và phòng thủ",
            weight: "4U",
            weightGrams: 83,
            balance: "Cân bằng",
            flexibility: "Trung bình",
            maxTension: "28 lbs",
            madeIn: "Japan",
            category: "Đa năng",
            rating: 4.8
        },
        {
            id: "Y002-3U",
            name: "Yonex Arcsaber 11 Pro",
            brand: "Yonex",
            price: 4200000,
            originalPrice: 4800000,
            images: [
                "img/Yonex/arc11-main.webp",
                "img/Yonex/arc11-stick2.webp",
                "img/Yonex/arc11-stickwebp.webp",
                "img/Yonex/arc11-stick3.webp"
            ],
            description: "Vợt cân bằng hoàn hảo giữa tấn công và phòng thủ",
            weight: "3U",
            weightGrams: 87,
            balance: "Cân bằng",
            flexibility: "Trung bình",
            maxTension: "28 lbs",
            madeIn: "Japan",
            category: "Đa năng",
            rating: 4.8
        },
        {
            id: "Y003-2U",
            name: "Yonex ISOMETRIC TR1",
            brand: "Yonex",
            price: 1359000,
            originalPrice: 1630000,
            images: [
                "img/Yonex/iso-tr1_blue.webp",
            ],
            description: "Vợt cầu lông Yonex ISOMETRIC TR1 chính hãng là sản phẩm vợt nặng chuyên dụng cho tập cổ tay với trọng lượng 118g hoàn hảo giúp lực tay của bạn khỏe lên từng ngày.",
            weight: "2U",
            weightGrams: 118,
            balance: "Cân bằng",
            flexibility: "Trung bình",
            maxTension: "30 lbs",
            madeIn: "Japan",
            category: "Tấn công",
            rating: 4.8
        },
        {
            id: "Y004-5U",
            name: "Yonex Nanoflare 800",
            brand: "Yonex",
            price: 3800000,
            originalPrice: 4200000,
            images: [
                "img/Yonex/nanoflare-800p_269-1.webp"
            ],
            description: "Nhanh nhẹn, xử lý cầu tốc độ cao. Phiên bản 5U siêu nhẹ.",
            weight: "5U",
            weightGrams: 78,
            balance: "Nhẹ đầu",
            flexibility: "Mềm",
            maxTension: "27 lbs",
            madeIn: "Japan",
            category: "Tốc độ",
            rating: 4.6
        },
        {
            id: "Y005-2U",
            name: "Yonex Duora Z-Strike",
            brand: "Yonex",
            price: 4709000,
            originalPrice: 5650000,
            images: [
                "img/Yonex/duo-zs.webp"
            ],
            description: "Yonex Duora Z-Strike nổi trội là một trong những cây vợt thành công nhất của nhà Yonex cho lối chơi toàn diện, chớp thời cơ tấn công nhanh chớp nhoáng khiến đối thủ sân bạn không kịp trở tay.",
            weight: "2U",
            weightGrams: 93,
            balance: "Hơi nặng đầu",
            flexibility: "Siêu cứng",
            maxTension: "29 lbs",
            madeIn: "Japan",
            category: "Đa Năng",
            rating: 4.6
        },
        {
            id: "Y005-3U",
            name: "Yonex Duora Z-Strike",
            brand: "Yonex",
            price: 4709000,
            originalPrice: 5650000,
            images: [
                "img/Yonex/duo-zs.webp"
            ],
            description: "Yonex Duora Z-Strike nổi trội là một trong những cây vợt thành công nhất của nhà Yonex cho lối chơi toàn diện, chớp thời cơ tấn công nhanh chớp nhoáng khiến đối thủ sân bạn không kịp trở tay.",
            weight: "2U",
            weightGrams: 89,
            balance: "Hơi nặng đầu",
            flexibility: "Siêu cứng",
            maxTension: "29 lbs",
            madeIn: "Japan",
            category: "Đa Năng",
            rating: 4.6
        },
        {
            id: "Y006-4U",
            name: "Yonex Astrox 99 Pro",
            brand: "Yonex",
            price: 4400000,
            originalPrice: 5000000,
            images: [
                "img/Yonex/axtrox99pro.webp",
                "img/Yonex/all_3ax99-p_530-2.webp",
                "img/Yonex/all_3ax99-p_530-3.webp",
                "img/Yonex/all_3ax99-p_530-4.webp",
                "img/Yonex/all_3ax99-p_530-5.webp"
            ],
            description: "Vợt tấn công của tay vợt số 1 thế giới Kento Momota",
            weight: "4U",
            weightGrams: 83,
            balance: "Nặng đầu",
            flexibility: "Cứng",
            maxTension: "30 lbs",
            madeIn: "Japan",
            category: "Tấn công",
            rating: 4.9
        },
        {
            id: "Y007-4U",
            name: "Yonex Nanoray GlanZ",
            brand: "Yonex",
            price: 3079000,
            originalPrice: 3694800,
            images: [
                "img/Yonex/nr-gz.webp"
            ],
            description: "Vợt cầu lông Yonex Nanoray GlanZ là cây vợt cao cấp trong dòng Nanoray của Yonex với những chất liệu và công nghệ đặc biệt dành riêng cho dòng vợt này.",
            weight: "4U",
            weightGrams: 85,
            balance: "Cân bằng",
            flexibility: "Trung bình",
            maxTension: "29 lbs",
            madeIn: "Đài loan",
            category: "Đa Năng",
            rating: 4.6
        },
    ],
    lining: [
        {
            id: "L001-3U",
            name: "Lining Aeronaut 9000",
            brand: "Lining",
            price: 4200000,
            originalPrice: 4800000,
            images: [
                "https://placehold.co/400x400/e74c3c/ffffff?text=Aeronaut+9000",
                "https://placehold.co/400x400/e74c3c/ffffff?text=Aeronaut+9000+Front",
                "https://placehold.co/400x400/e74c3c/ffffff?text=Aeronaut+9000+Side",
                "https://placehold.co/400x400/e74c3c/ffffff?text=Aeronaut+9000+Detail"
            ],
            description: "Vợt cao cấp nhất của Lining với công nghệ Wing Stabilizer",
            weight: "3U",
            weightGrams: 88,
            balance: "Nặng đầu",
            flexibility: "Cứng",
            maxTension: "32 lbs",
            madeIn: "China",
            category: "Tấn công",
            rating: 4.8
        },
        {
            id: "L001-4U",
            name: "Lining Aeronaut 9000",
            brand: "Lining",
            price: 4200000,
            originalPrice: 4800000,
            images: [
                "https://placehold.co/400x400/e74c3c/ffffff?text=Aeronaut+9000",
                "https://placehold.co/400x400/e74c3c/ffffff?text=Aeronaut+9000+4U",
                "https://placehold.co/400x400/e74c3c/ffffff?text=Aeronaut+9000+4U+Side"
            ],
            description: "Vợt cao cấp của Lining. Phiên bản 4U nhẹ và nhanh hơn.",
            weight: "4U",
            weightGrams: 83,
            balance: "Nặng đầu",
            flexibility: "Cứng",
            maxTension: "32 lbs",
            madeIn: "China",
            category: "Tấn công",
            rating: 4.8
        },
        {
            id: "L003-4U",
            name: "Lining N99",
            brand: "Lining",
            price: 3500000,
            originalPrice: 4000000,
            images: [
                "https://placehold.co/400x400/e74c3c/ffffff?text=N99",
                "https://placehold.co/400x400/e74c3c/ffffff?text=N99+Front",
                "https://placehold.co/400x400/e74c3c/ffffff?text=N99+Side",
                "https://placehold.co/400x400/e74c3c/ffffff?text=N99+Detail"
            ],
            description: "Vợt của Lin Dan, kiểm soát và tấn công hoàn hảo",
            weight: "4U",
            weightGrams: 83,
            balance: "Cân bằng",
            flexibility: "Trung bình",
            maxTension: "30 lbs",
            madeIn: "China",
            category: "Đa năng",
            rating: 4.8
        },
        {
            id: "L004-5U",
            name: "Lining Windstorm 78",
            brand: "Lining",
            price: 3200000,
            originalPrice: 3700000,
            images: [
                "https://placehold.co/400x400/e74c3c/ffffff?text=Windstorm+78",
                "https://placehold.co/400x400/e74c3c/ffffff?text=Windstorm+78+Front",
                "https://placehold.co/400x400/e74c3c/ffffff?text=Windstorm+78+Side"
            ],
            description: "Tốc độ swing nhanh với công nghệ Aerotec-Beam System",
            weight: "5U",
            weightGrams: 78,
            balance: "Nhẹ đầu",
            flexibility: "Mềm",
            maxTension: "28 lbs",
            madeIn: "China",
            category: "Tốc độ",
            rating: 4.5
        },
        {
            id: "L005-4U",
            name: "Lining 3D Calibar 900",
            brand: "Lining",
            price: 4000000,
            originalPrice: 4500000,
            images: [
                "https://placehold.co/400x400/e74c3c/ffffff?text=3D+Calibar+900",
                "https://placehold.co/400x400/e74c3c/ffffff?text=3D+Calibar+900+Front",
                "https://placehold.co/400x400/e74c3c/ffffff?text=3D+Calibar+900+Side",
                "https://placehold.co/400x400/e74c3c/ffffff?text=3D+Calibar+900+Detail"
            ],
            description: "Khung vợt 3D độc đáo, tăng vùng ngọt khi đánh",
            weight: "4U",
            weightGrams: 83,
            balance: "Cân bằng",
            flexibility: "Trung bình",
            maxTension: "30 lbs",
            madeIn: "China",
            category: "Đa năng",
            rating: 4.7
        }
    ],
    victor: [
        {
            id: "V001-3U",
            name: "Victor Thruster K Falcon",
            brand: "Victor",
            price: 4100000,
            originalPrice: 4700000,
            images: [
                "https://placehold.co/400x400/3498db/ffffff?text=TK+Falcon",
                "https://placehold.co/400x400/3498db/ffffff?text=TK+Falcon+Front",
                "https://placehold.co/400x400/3498db/ffffff?text=TK+Falcon+Side",
                "https://placehold.co/400x400/3498db/ffffff?text=TK+Falcon+Detail"
            ],
            description: "Vợt của Axelsen, công nghệ PYROFIL độc quyền",
            weight: "3U",
            weightGrams: 88,
            balance: "Nặng đầu",
            flexibility: "Cứng",
            maxTension: "32 lbs",
            madeIn: "Taiwan",
            category: "Tấn công",
            rating: 4.9
        },
        {
            id: "V001-4U",
            name: "Victor Thruster K Falcon",
            brand: "Victor",
            price: 4100000,
            originalPrice: 4700000,
            images: [
                "https://placehold.co/400x400/3498db/ffffff?text=TK+Falcon",
                "https://placehold.co/400x400/3498db/ffffff?text=TK+Falcon+4U",
                "https://placehold.co/400x400/3498db/ffffff?text=TK+Falcon+4U+Side"
            ],
            description: "Vợt của Axelsen. Phiên bản 4U cân bằng lực và tốc độ.",
            weight: "4U",
            weightGrams: 83,
            balance: "Nặng đầu",
            flexibility: "Cứng",
            maxTension: "32 lbs",
            madeIn: "Taiwan",
            category: "Tấn công",
            rating: 4.9
        },
        {
            id: "V002-5U",
            name: "Victor Auraspeed 90K",
            brand: "Victor",
            price: 3700000,
            originalPrice: 4200000,
            images: [
                "https://placehold.co/400x400/3498db/ffffff?text=ARS+90K",
                "https://placehold.co/400x400/3498db/ffffff?text=ARS+90K+Front",
                "https://placehold.co/400x400/3498db/ffffff?text=ARS+90K+Side"
            ],
            description: "Tốc độ đỉnh cao với công nghệ Nano Fortify",
            weight: "5U",
            weightGrams: 78,
            balance: "Nhẹ đầu",
            flexibility: "Mềm",
            maxTension: "30 lbs",
            madeIn: "Taiwan",
            category: "Tốc độ",
            rating: 4.7
        },
        {
            id: "V003-4U",
            name: "Victor Jetspeed S12",
            brand: "Victor",
            price: 3900000,
            originalPrice: 4400000,
            images: [
                "https://placehold.co/400x400/3498db/ffffff?text=JS+S12",
                "https://placehold.co/400x400/3498db/ffffff?text=JS+S12+Front",
                "https://placehold.co/400x400/3498db/ffffff?text=JS+S12+Side",
                "https://placehold.co/400x400/3498db/ffffff?text=JS+S12+Detail"
            ],
            description: "Aerodynamic Frame giảm sức cản không khí tối đa",
            weight: "4U",
            weightGrams: 83,
            balance: "Cân bằng",
            flexibility: "Trung bình",
            maxTension: "30 lbs",
            madeIn: "Taiwan",
            category: "Đa năng",
            rating: 4.8
        },
        {
            id: "V005-4U",
            name: "Victor Bravesword 12",
            brand: "Victor",
            price: 3500000,
            originalPrice: 4000000,
            images: [
                "https://placehold.co/400x400/3498db/ffffff?text=BS+12",
                "https://placehold.co/400x400/3498db/ffffff?text=BS+12+Front",
                "https://placehold.co/400x400/3498db/ffffff?text=BS+12+Side",
                "https://placehold.co/400x400/3498db/ffffff?text=BS+12+Detail"
            ],
            description: "Sword concept, chém cầu mạnh mẽ và chính xác",
            weight: "4U",
            weightGrams: 83,
            balance: "Nặng đầu",
            flexibility: "Hơi cứng",
            maxTension: "30 lbs",
            madeIn: "Taiwan",
            category: "Tấn công",
            rating: 4.6
        }
    ],
    mizuno: [
        {
            id: "M001-3U",
            name: "Mizuno Fortius Tour F",
            brand: "Mizuno",
            price: 3900000,
            originalPrice: 4500000,
            images: [
                "https://placehold.co/400x400/9b59b6/ffffff?text=Fortius+Tour+F",
                "https://placehold.co/400x400/9b59b6/ffffff?text=Fortius+Tour+F+Front",
                "https://placehold.co/400x400/9b59b6/ffffff?text=Fortius+Tour+F+Side",
                "https://placehold.co/400x400/9b59b6/ffffff?text=Fortius+Tour+F+Detail"
            ],
            description: "Vợt cao cấp nhất Mizuno với Hot Melt Tech",
            weight: "3U",
            weightGrams: 88,
            balance: "Nặng đầu",
            flexibility: "Cứng",
            maxTension: "30 lbs",
            madeIn: "Japan",
            category: "Tấn công",
            rating: 4.7
        },
        {
            id: "M001-4U",
            name: "Mizuno Fortius Tour F",
            brand: "Mizuno",
            price: 3900000,
            originalPrice: 4500000,
            images: [
                "https://placehold.co/400x400/9b59b6/ffffff?text=Fortius+Tour+F",
                "https://placehold.co/400x400/9b59b6/ffffff?text=Fortius+Tour+F+4U",
                "https://placehold.co/400x400/9b59b6/ffffff?text=Fortius+Tour+F+4U+Side"
            ],
            description: "Vợt cao cấp nhất Mizuno. Phiên bản 4U nhẹ hơn.",
            weight: "4U",
            weightGrams: 83,
            balance: "Nặng đầu",
            flexibility: "Cứng",
            maxTension: "30 lbs",
            madeIn: "Japan",
            category: "Tấn công",
            rating: 4.7
        },
        {
            id: "M003-4U",
            name: "Mizuno Caliber Regnas",
            brand: "Mizuno",
            price: 3300000,
            originalPrice: 3800000,
            images: [
                "https://placehold.co/400x400/9b59b6/ffffff?text=Caliber+Regnas",
                "https://placehold.co/400x400/9b59b6/ffffff?text=Caliber+Regnas+Front",
                "https://placehold.co/400x400/9b59b6/ffffff?text=Caliber+Regnas+Side"
            ],
            description: "Độ ổn định cao với công nghệ Sonic Metal",
            weight: "4U",
            weightGrams: 83,
            balance: "Nặng đầu",
            flexibility: "Hơi cứng",
            maxTension: "30 lbs",
            madeIn: "Japan",
            category: "Tấn công",
            rating: 4.5
        },
        {
            id: "M004-5U",
            name: "Mizuno Altius 03 Speed",
            brand: "Mizuno",
            price: 3100000,
            originalPrice: 3600000,
            images: [
                "https://placehold.co/400x400/9b59b6/ffffff?text=Altius+03",
                "https://placehold.co/400x400/9b59b6/ffffff?text=Altius+03+Front",
                "https://placehold.co/400x400/9b59b6/ffffff?text=Altius+03+Side",
                "https://placehold.co/400x400/9b59b6/ffffff?text=Altius+03+Detail"
            ],
            description: "Tốc độ cao với trọng lượng cực nhẹ",
            weight: "5U",
            weightGrams: 78,
            balance: "Nhẹ đầu",
            flexibility: "Mềm",
            maxTension: "28 lbs",
            madeIn: "China",
            category: "Tốc độ",
            rating: 4.4
        },
        {
            id: "M002-4U",
            name: "Mizuno Fortius Pro",
            brand: "Mizuno",
            price: 3500000,
            originalPrice: 4000000,
            images: [
                "https://placehold.co/400x400/9b59b6/ffffff?text=Fortius+Pro",
                "https://placehold.co/400x400/9b59b6/ffffff?text=Fortius+Pro+Front",
                "https://placehold.co/400x400/9b59b6/ffffff?text=Fortius+Pro+Side",
                "https://placehold.co/400x400/9b59b6/ffffff?text=Fortius+Pro+Detail"
            ],
            description: "Công nghệ Wave Rib Frame độc quyền của Mizuno",
            weight: "4U",
            weightGrams: 83,
            balance: "Cân bằng",
            flexibility: "Trung bình",
            maxTension: "29 lbs",
            madeIn: "Japan",
            category: "Đa năng",
            rating: 4.6
        }
    ]
};
