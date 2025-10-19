import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

// Map chainId to chain config
const getChain = (chainId: number) => {
  switch (chainId) {
    case 1:
      return mainnet;
    case 11155111:
      return sepolia;
    default:
      return mainnet;
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { txHash, chainId = 1 } = body;

    if (!txHash) {
      return NextResponse.json(
        { error: 'Transaction hash is required' },
        { status: 400 }
      );
    }

    // Validate txHash format
    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      return NextResponse.json(
        { error: 'Invalid transaction hash format' },
        { status: 400 }
      );
    }

    // Create public client for RPC verification
    const chain = getChain(chainId);
    const client = createPublicClient({
      chain,
      transport: http(),
    });

    // Fetch transaction receipt from chain
    const receipt = await client.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    if (!receipt) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Verify transaction was successful
    if (receipt.status !== 'success') {
      return NextResponse.json(
        { error: 'Transaction failed on chain', receipt },
        { status: 400 }
      );
    }

    // Get full transaction details
    const transaction = await client.getTransaction({
      hash: txHash as `0x${string}`,
    });

    // Return verified transaction data
    return NextResponse.json({
      verified: true,
      txHash,
      chainId,
      blockNumber: receipt.blockNumber.toString(),
      from: receipt.from,
      to: receipt.to,
      value: transaction.value.toString(),
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('Transaction verification error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: 'Failed to verify transaction', details: errorMessage },
      { status: 500 }
    );
  }
}
