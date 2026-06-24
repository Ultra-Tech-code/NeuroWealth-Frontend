"use client";

import { useWallet } from "@/contexts";
import {
  WalletIcon,
  CheckCircleIcon,
  WarningIcon,
} from "@/components/wallet/wallet-icons";

interface WalletStatusBadgeProps {
  size?: "sm" | "md" | "lg";
  showNetwork?: boolean;
  compact?: boolean;
}

export function WalletStatusBadge({
  size = "md",
  showNetwork = true,
  compact = false,
}: WalletStatusBadgeProps) {
  const { connected, publicKey, walletName, networkStatus } = useWallet();

  if (!connected || !publicKey) {
    return null;
  }

  const truncatedAddress = `${publicKey.slice(0, 6)}...${publicKey.slice(-6)}`;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-2 text-sm",
    lg: "px-4 py-2.5 text-base",
  };

  const iconSizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 ${sizeClasses[size]}`}
        data-qa="wallet-status-badge"
      >
        <CheckCircleIcon
          className={`${iconSizeClasses[size]} text-green-600`}
        />
        <span className="font-medium text-green-900">{truncatedAddress}</span>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-3 space-y-2"
      data-qa="wallet-status-badge"
    >
      {/* Wallet Connection Status */}
      <div className="flex items-center gap-2">
        <CheckCircleIcon className="w-4 h-4 text-green-600" />
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-medium uppercase">Wallet</p>
          <p className="text-sm font-semibold text-gray-900">{walletName}</p>
        </div>
      </div>

      {/* Public Key / Address */}
      <div className="flex items-start gap-2 pt-2 border-t border-gray-100">
        <WalletIcon className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium uppercase">Address</p>
          <code className="text-xs text-gray-700 break-all font-mono">
            {publicKey}
          </code>
          <p className="text-xs text-gray-400 mt-1">{truncatedAddress}</p>
        </div>
      </div>

      {/* Network Status */}
      {showNetwork && (
        <div
          className={`flex items-center gap-2 pt-2 border-t border-gray-100 ${
            networkStatus.hasMismatch ? "text-amber-600" : "text-green-600"
          }`}
        >
          {networkStatus.hasMismatch ? (
            <WarningIcon className="w-4 h-4" />
          ) : (
            <CheckCircleIcon className="w-4 h-4" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase">Network</p>
            <p className="text-sm font-semibold">
              {networkStatus.hasMismatch ? (
                <span className="text-amber-600">Mismatch</span>
              ) : (
                <span className="text-green-600">
                  {networkStatus.appNetworkLabel}
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
