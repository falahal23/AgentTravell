import * as React from "react";

import { cn } from "@/lib/utils";

function Table({ className, ...props }) {
  return (
    <div
      data-slot="table-container"
      className="
      relative
      w-full
      overflow-x-auto
      rounded-3xl
      border
      border-slate-100
      bg-white
      shadow-xl
      shadow-slate-200/50
      "
    >
      <table
        data-slot="table"
        className={cn(
          `
          w-full
          caption-bottom
          text-sm
          border-collapse
          `,
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        `
        bg-[#1e293b]
        text-white
        [&_tr]:border-none
        `,
        className,
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        `
        divide-y
        divide-slate-100
        bg-white
        `,
        className,
      )}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        `
        bg-slate-50
        font-semibold
        `,
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        `
        transition-all
        duration-200

        hover:bg-teal-50/60
        hover:shadow-sm
        
        data-[state=selected]:bg-teal-50
        `,
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        `
        h-14
        px-8

        text-left
        align-middle

        text-[11px]
        font-black
        uppercase
        tracking-widest

        text-white
        whitespace-nowrap
        `,
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        `
        px-8
        py-5

        align-middle
        whitespace-nowrap

        text-slate-700
        font-medium
        `,
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        `
        mt-5
        text-sm
        text-slate-400
        `,
        className,
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
