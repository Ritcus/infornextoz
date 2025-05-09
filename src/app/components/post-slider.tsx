"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Post } from "@/types/post";
import { usePostNavigation } from "@/lib/usePostNavigation";
import { urlFor } from "../../../sanity/lib/image";
import { useGlobalData } from "@/lib/globalData";
import { postsQuery } from "@/lib/queries";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

export default function PopularPostsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  //const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const { data: cachedPosts } = useGlobalData<Post[]>(postsQuery);
  const popularPosts = cachedPosts!.filter(post => post.popularity|| 0 > 10).slice(0, 5);
  const { navigateToPost } = usePostNavigation();

  // useEffect(() => {
  //   async function fetchPopularPosts() {
  //     try {
  //       //const data = await getAllPosts();
  //       //const filteredData = data.filter((post) => post.popularity|| 0 > 10);
  //       setPopularPosts(popularPosts);
  //     } catch (error) {
  //       console.error("Error fetching posts:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchPopularPosts();
  //   console.log(popularPosts);
  // }, []);

  // Move to next group of 3
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 3) % popularPosts.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 3 + popularPosts.length) % popularPosts.length
    );
  };

  useEffect(() => {
    if (popularPosts.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const getVisiblePosts = () => {
    if (popularPosts.length === 0) return [];
    const posts = [];
    for (let i = 0; i < 3; i++) {
      posts.push(popularPosts[(currentIndex + i) % popularPosts.length]);
    }
    return posts;
  };

  const visiblePosts = getVisiblePosts();

  if (popularPosts.length === 0) return null;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="text-center mb-8">
     
        <h3 className="font-bold text-black text-xl sm:text-2xl inline-block px-4">
          Popular Posts
        </h3>
        <div className="h-2 w-full bg-purple-800"></div>
        <button
          onClick={prevSlide}
          className=" md:hidden bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100"
        >
          <ArrowBigUp />
        </button>
        
      </div> 
      

      <div className="relative">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl w-full">
            {visiblePosts.map((post, index) => (
              <div
                key={`${post._id}-${index}`}
                className="cursor-pointer bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-gray-50"
                onClick={() => navigateToPost(post)}
                style={{
                  cursor: "pointer", // Changes to grab hand cursor
                }}
              >
                <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
                  <Image
                    src={urlFor(post.mainImage).url()}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority
                  />
                </div>
                <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium text-purple-800">
                    {post.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={prevSlide}
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100"
        >
          &lt;
        </button>
        <button
          onClick={nextSlide}
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100"
        >
          &gt;
        </button>
        <div className="flex justify-center">
        <button
          onClick={prevSlide}
          className="md:hidden absolute bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100"
        >
          <ArrowBigDown />
        </button>
        </div>
      </div>
      
    </div>
  );
}
