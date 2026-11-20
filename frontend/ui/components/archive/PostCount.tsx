"use client";

import pluralize from 'pluralize';

export function PostCount({
  postType,
  totalPosts,
  totalPages,
  perPage,
  currentPage,
  isLoadMore,
}: {
  postType: string,
  totalPosts: any,
  totalPages: any,
  perPage: any,
  currentPage: any,
  isLoadMore: boolean,
}) {
  const calculateCount = () => {
    const from = isLoadMore
      ? 1
      : (currentPage === 1 ? currentPage : (currentPage - 1) * parseInt(perPage) + 1);
    const to = totalPages == currentPage ? totalPosts : currentPage * parseInt(perPage);
    const type = pluralize(postType, Number(totalPosts));
    return totalPosts == 0 ? `${totalPosts} ${type} found` : `Showing ${from} to ${to} of ${totalPosts} ${type}`;
  };

  return (
    <div className="archive-count label flex flex-row text-muted">
      {calculateCount()}
    </div>
  );
}